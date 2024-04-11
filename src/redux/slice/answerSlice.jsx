import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setContent } from './contentSlice';
import { v4 as uuidv4 } from 'uuid';
import {updateMessageList,updateSingleItem } from './messageListSlice';

import configData from '../../data/config.json';

const config = JSON.parse(localStorage.getItem(configData.config_key)) || configData;


const generateUniqueId = () => uuidv4();

function getMsg(_id, role, name, msg, img,isloading) {
  const newMessage = {
    id: _id,
    role: role,
    name: name,
    desc: msg,
    imgUrl: img,
    timestamp: new Date().toISOString(),
    isLoading:isloading
  };
  return newMessage;
}


export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl:config.service_url }),
  endpoints: (builder) => ({
    fetchAnswer: builder.query({
      queryFn: async (message, { dispatch }) => {
        return new Promise(async (resolve, reject) => {
          try {

            const user_msg_id = generateUniqueId();

            const t = getMsg(user_msg_id, "user",config.user_name, message,config.user_img_url,false);

            var messageList = JSON.parse(localStorage.getItem(config.message_list_key)) || [],

            messageList = [...messageList, t]

            // console.log('message', messageList);

            dispatch(updateMessageList(messageList));

            const system_msg_id = generateUniqueId();

            const sysMsg = getMsg(system_msg_id, "system",config.model_name, "",config.model_img_url,true);

            messageList = JSON.parse(localStorage.getItem(config.message_list_key)) || [],

            messageList = [...messageList, sysMsg];

            dispatch(updateMessageList(messageList));

            var content = "";

            dispatch(setContent({isLoading:true,value:content}));

            // dispatch(updateSingleItem({id:system_msg_id,desc: content,isLoading:true}));

            const response = await fetch(config.service_url, {
              method: 'POST',
              body: JSON.stringify({
                model: 'gpt-4',
                stream: true,
                messages: [
                  {
                    content: message,
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
                    dispatch(setContent({isLoading:false,value:content}));
                    dispatch(updateSingleItem({id:system_msg_id,desc: content,isLoading:false}));
                    break;
                }
                try {
                  const json = JSON.parse(c);
                  if (config.service_url.includes("8080")) {
                    content += json.choices[0].delta.content;
                  } else if (config.service_url.includes("7077")) {
                    content = json.choices[0].message.content;
                  }

                  dispatch(updateSingleItem({id:system_msg_id,desc: content,isLoading:true}));
                  dispatch(setContent({isLoading:true,value:content}));
                } catch (e) {
                  console.log('Error parsing JSON:', c,rawJsonString);
                }
              }
            }
            resolve({ data: {} }); // resolve the Promise when done processing the response
          } catch (error) {
            dispatch(setContent({isLoading:false,value:content}));
            reject(error); // reject the Promise if an error occurs
          }
        });
      },
    }),

  }),
});

export const { useFetchAnswerQuery } = api;
export default api;
