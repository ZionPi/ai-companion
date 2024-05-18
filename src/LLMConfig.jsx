import React, { useEffect, useRef, useState } from 'react';
import colorsData from './data/colors.json';
import { useDispatch, useSelector } from 'react-redux';
import { saveConfig } from './redux/slice/configSlice';
import {updateApiKey,updateActiveProvider} from './redux/slice/answerSlice'
function LLMConfig() {

    const dispatch = useDispatch();

    const configData = useSelector(state => state.config.config);

    const llms_config = {
        "active_provider": "Google",
        "provider_list": [
            {
                "provider": "Google",
                "service_url": "",
                "api_key": "",
                "active_model": "",
                "model_list": [
                    "gemini-1.5-pro-latest",
                    "gemini-pro"
                ],
                "model_img_url": "https://cdn.pixabay.com/photo/2020/10/23/17/52/fox-5679446_1280.png"
            },
            {
                "provider": "Coze",
                "service_url": "http://127.0.0.1:7077/v1/chat/completions",
                "api_key": "",
                "active_model": "",
                "model_list": [],
                "model_img_url": "https://cdn.pixabay.com/photo/2016/03/31/20/31/amazed-1295833_960_720.png"
            },
            {
                "provider": "OpenAI",
                "service_url": "",
                "api_key": "",
                "active_model": "",
                "model_list": [
                    "gpt3.5",
                    "gpt4"
                ],
                "model_img_url": "https://cdn.pixabay.com/photo/2015/01/17/21/50/insect-602547_1280.png"
            }
        ]
    };

    const [llms, setLlms] = useState(configData.llms['provider_list'] || llms_config['provider_list']);

    const [active_provider,setActiveProvider] = useState(configData.llms["active_provider"] || llms_config['active_provider']);

    useEffect(() => {

        if (active_provider) {
            const updatedLLMConfig = {
                ...configData.llms,
                ['active_provider']: active_provider
            }

            const updatedConfigData = {
                ...configData,
                ['llms']: updatedLLMConfig
            };

            dispatch(saveConfig(updatedConfigData));

            dispatch(updateActiveProvider(active_provider));
        }

    }, [active_provider]);


    // const radioRef = useRef(null);

    // // Function to trigger radio button click
    // const handleParentClick = () => {
    //     if(!radioRef)
    //         radioRef.current.click();
    // };

    const handleInputChange = (event, llmIndex, fieldName) => {

        const llms = configData.llms['provider_list'];

        const updatedLlms = [...llms];

        // Update the specific field of the specific LLM configuration
        updatedLlms[llmIndex] = {
            ...updatedLlms[llmIndex],
            [fieldName]: event.target.value,

        };

        // // Set the updated llms array back to the state

        setLlms(updatedLlms);

        const updatedLLMConfig = {
            ...configData.llms,
            ['provider_list']: updatedLlms
        }

        const updatedConfigData = {
            ...configData,
            ['llms'] : updatedLLMConfig
        };

        if(fieldName === "api_key" && updatedLlms[llmIndex].provider === "Google") {
            dispatch(updateApiKey(event.target.value));
        }

        dispatch(saveConfig(updatedConfigData));
    };

  

    return (
        <div className=" mx-0 p-1">
            <div className="text-xl  mb-4">LLM 配置</div>
            {llms.map((llm, llmIndex) => (
                <div key={llmIndex} flex justify-start
                    // onClick={handleParentClick}
                    className="bg-white hover:bg-gray-200 shadow rounded p-4 mb-4 relative">
                    <div className="absolute top-2 right-2">
                        <input
                            type="radio"
                            // ref={radioRef}
                            id={`provider_${llmIndex}`}
                            name="single_only_radio"
                            checked={active_provider === llm.provider}
                            onChange={() => setActiveProvider(llm.provider)}
                            className=" w-6 h-6 appearance-none rounded-full  border border-gray-400 checked:bg-green-500"
                        // Checked state and onChange handler as needed
                        />

                    </div>

                    <div className="mb-2">
                        <label htmlFor={`provider-${llmIndex}`} className="block font-bold text-gray-700">
                            供应商:
                        </label>

                        <label className={`text-lg text-[#ffffff]  text-bold w-full p-1 rounded-xl bg-[${colorsData.bg_color}]`}>{llm.provider}</label>
                    </div>
                    <div className="mb-2">
                        <label htmlFor={`service_url-${llmIndex}`} className="block font-bold text-gray-700">
                            Service URL:
                        </label>
                        <input
                            type="text"
                            id={`service_url-${llmIndex}`}
                            className="border rounded w-full p-2"
                            value={llm.service_url}
                            onChange={(e) => handleInputChange(e, llmIndex, 'service_url')}
                        />
                    </div>
                    <div className="mb-2">
                        <label htmlFor={`api_key-${llmIndex}`} className="block font-bold text-gray-700">
                            API Key:
                        </label>
                        <input
                            type="text"
                            id={`api_key-${llmIndex}`}
                            className="border rounded w-full p-2"
                            value={llm.api_key}
                            onChange={(e) => handleInputChange(e, llmIndex, 'api_key')}
                        />
                    </div>
                    <div className="mb-2">
                        {llm.model_list.length > 0 && (
                            <label className="block font-bold text-gray-700">Model List:</label>
                        )}
                        {llm.model_list.map((model, modelIndex) => (
                            <div key={modelIndex} className="flex items-center gap-1">
                                {/* <input
                                    type="text"
                                    className="border rounded mr-2 p-2"
                                    value={model}
                                    onChange={(e) => {
                                        const updatedLlms = [...llms];
                                        updatedLlms[llmIndex].model_list[modelIndex] = e.target.value;
                                        setLlms(updatedLlms);
                                    }}
                                /> */}

                                <label className="border-none rounded mr-2 p-2 text-lg" >{model}</label>

                                <input
                                    type="radio"
                                    id={`${model.provider}_${model.model}`}
                                    name={`${model.provider}_model`}
                                    className=" w-5 h-5 appearance-none rounded-full  border border-gray-400 checked:bg-green-500"
                                // Checked state and onChange handler as needed
                                />




                                {/* Add button to remove model from list */}
                            </div>
                        ))}
                        {/* Add button to add new model to list */}
                    </div>
                </div>
            ))}
            {/* Add button to add new LLM configuration */}
        </div>
    );
}

export default LLMConfig;