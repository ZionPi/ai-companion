import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setContent } from './contentSlice';
import { v4 as uuidv4 } from 'uuid';
import { updateMessageList, updateSingleItem } from './messageListSlice';
import configData from '../../data/config.json';
import { GoogleGenerativeAI,HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

import { createSlice } from '@reduxjs/toolkit';


const generateUniqueId = () => uuidv4();

const config = JSON.parse(localStorage.getItem(configData.config_key)) || configData;

let active_provider_name = config.llms.active_provider;

let active_provider = config.llms.provider_list.find((t) => t.provider == active_provider_name);

let genAI = new GoogleGenerativeAI(config.llms.provider_list.find((t) => t.provider == "Google").api_key);


// Define the slice

export const genAISlice = createSlice({
  name: 'genAI',
  initialState: { apiKey: config.llms.provider_list.find((t) => t.provider == "Google").api_key },
  reducers: {
    updateApiKey: (state, action) => {
      state.apiKey = action.payload; // is it necessary to try here?
      genAI = new GoogleGenerativeAI(state.apiKey);
    },

    updateActiveProvider: (state,action) => {

      if(state.payload) {
        active_provider_name = action.payload;
        active_provider = config.llms.provider_list.find((t) => t.provider == active_provider_name);
      }
    }
  },
});

const { actions, genAIReducer } = genAISlice

export const { updateApiKey,updateActiveProvider } = actions;




function getMsg(_id, role, name, msg, img, isloading) {
  const newMessage = {
    id: _id,
    role: role,
    name: name,
    desc: msg,
    imgUrl: img,
    timestamp: new Date().toISOString(),
    isLoading: isloading,
  };
  return newMessage;
}


async function processMessage(message, dispatch, systemModelName) {
  return new Promise(async (resolve, reject) => {
    try {
      let prompt = ""
      if (typeof message === 'string') {
        prompt = message;
      }
      else if (Array.isArray(message)) {
        prompt = message[0];
      }
      else {

      }

      const user_msg_id = generateUniqueId();
      const userMsg = getMsg(user_msg_id, "user", config.user_name, prompt, config.user_img_url, false);
      let messageList = JSON.parse(localStorage.getItem(config.message_list_key)) || [];
      messageList = [...messageList, userMsg];
      dispatch(updateMessageList(messageList));

      const system_msg_id = generateUniqueId();
      const sysMsg = getMsg(system_msg_id, "system", systemModelName, "", active_provider.model_img_url, true);
      messageList = JSON.parse(localStorage.getItem(config.message_list_key)) || [];
      messageList = [...messageList, sysMsg];
      dispatch(updateMessageList(messageList));

      let content = "";
      dispatch(setContent({ isLoading: true, value: content }));

      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        }
      ];

      try {

        console.log('message is :', message);

        // Different behavior depending on whether it's Google API or not
        if (systemModelName === "gemini-1.5-pro-latest") {

            const model = genAI.getGenerativeModel({ model: systemModelName, safetySettings }, {
              apiVersion: 'v1beta',
            });

            const result = await model.generateContentStream(message);

            // const chat =  model.startChat()

            // const result = await chat.generateContentStream(message)

            for await (const chunk of result.stream) {

              try {
                const chunkText = chunk.text();
                content += chunkText;

                dispatch(setContent({ isLoading: true, value: content }));

                dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: true }));

              } catch (error) {
                //if something is wrong,notify to ui.
                dispatch(setContent({ isLoading: false, value: content }));
                dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: false }));
                console.log("error", error);
                reject(error);
              }
            }

        } else if(systemModelName === "gemini-1.5-flash") {

            const model = genAI.getGenerativeModel({ model: systemModelName, safetySettings }, {
              apiVersion: 'v1beta',
            });

            const result = await model.generateContentStream(message);

            for await (const chunk of result.stream) {

              try {
                const chunkText = chunk.text();
                content += chunkText;

                dispatch(setContent({ isLoading: true, value: content }));

                dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: true }));

              } catch (error) {
                //if something is wrong,notify to ui.
                dispatch(setContent({ isLoading: false, value: content }));
                dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: false }));
                console.log("error", error);
                reject(error);
              }
            }

        } else if(systemModelName === "coze") {

          const response = await fetch(active_provider.service_url, {
              method: 'POST',
              body: JSON.stringify({
                model: 'gpt-4',
                stream: true,
                messages: [
                  {
                    content: prompt,
                    role: 'user'
                  }
                ]
              }),
            });
            const reader = response.body.getReader();

            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              const rawJsonString = new TextDecoder().decode(value);
              const dataStringList = rawJsonString.split("data:");//this is may not be correct if the response has the data: 
              for (let i = 1; i < dataStringList.length; i++) {
                const c = dataStringList[i];
                if (c.trim() === '[DONE]') {
                  dispatch(setContent({ isLoading: false, value: content }));
                  dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: false }));
                  break;
                }
                try {
                  const json = JSON.parse(c);
                  if (active_provider.service_url.includes("8080")) {
                    content += json.choices[0].delta.content;
                  } else if (active_provider.service_url.includes("7077")) {
                    content = json.choices[0].message.content;
                  }

                  dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: true }));
                  dispatch(setContent({ isLoading: true, value: content }));
                } catch (e) {
                  console.log('Error parsing JSON:', c, rawJsonString);
                }
              }
            }
            resolve({ data: {} }); // resolve the Promise when done processing the response
        }
      } catch (apiError) {
        // Handle API specific errors here
        console.error('API Error:', apiError);
        reject('Failed to generate response.');
      }

      // Update the UI when done processing
      dispatch(setContent({ isLoading: false, value: content }));
      dispatch(updateSingleItem({ id: system_msg_id, desc: content, isLoading: false }));
    } catch (error) {
      // Handle general errors here
      console.error('Error:', error);
      dispatch(setContent({ isLoading: false, value: "An error occurred. Please try again." }));
      dispatch(updateSingleItem({ id: system_msg_id, desc: "An error occurred.", isLoading: false }));
      reject(error.message);
    }

  });

}


export const answerApi = createApi({
  reducerPath: 'answerApi',
  baseQuery: fetchBaseQuery({ baseUrl: active_provider.service_url }),
  endpoints: (builder) => ({

    fetchAnswer: builder.query({
      queryFn: async (message, { dispatch }) => {
        await processMessage(message, dispatch, "coze");
      },
    }),

    fetchGoogleAnswer: builder.query({
      queryFn: async (message, { dispatch }) => {
        const google_model = "gemini-1.5-pro-latest";
        await processMessage(message, dispatch, google_model);
      },
    }),

    fetchGoogleMultipleModalAnswer: builder.query({
      queryFn: async (message, { dispatch }) => {
        const google_model = "gemini-1.5-pro-latest";
        await processMessage(message, dispatch, google_model);
      },
    }),


  }),
});

// export const { useFetchGoogleAnswerQuery, useFetchAnswerQuery } = answerApi;
export default answerApi;
