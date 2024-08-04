import React, { useEffect, useState } from 'react';
import colorsData from './data/colors.json';
import { useDispatch, useSelector } from 'react-redux';
import { saveConfig } from './redux/slice/configSlice';
import { updateApiKey, updateActiveProvider,updateActiveModel } from './redux/slice/answerSlice';

function LLMConfig() {
    const dispatch = useDispatch();
    const configData = useSelector(state => state.config.config);

    const [llms, setLlms] = useState(configData.llms.provider_list);
    const [active_provider, setActiveProvider] = useState(configData.llms.active_provider);

    useEffect(() => {
        if (active_provider) {
            const updatedConfigData = {
                ...configData,
                llms: {
                    ...configData.llms,
                    active_provider: active_provider
                }
            };
            dispatch(saveConfig(updatedConfigData));
            dispatch(updateActiveProvider(active_provider));
        }
    }, [active_provider]);

    const handleModelChange = (llmIndex, model) => {
        const updatedLlms = llms.map((llm, index) => 
            index === llmIndex ? { ...llm, active_model: model } : llm
        );
        setLlms(updatedLlms);

        const updatedConfigData = {
            ...configData,
            llms: {
                ...configData.llms,
                provider_list: updatedLlms
            }
        };
        dispatch(saveConfig(updatedConfigData));

        // Dispatch the updateActiveModel action
        dispatch(updateActiveModel({ provider: updatedLlms[llmIndex].provider, model }));
    };

    const handleInputChange = (event, llmIndex, fieldName) => {
        const updatedLlms = llms.map((llm, index) => 
            index === llmIndex ? { ...llm, [fieldName]: event.target.value } : llm
        );
        setLlms(updatedLlms);

        const updatedConfigData = {
            ...configData,
            llms: {
                ...configData.llms,
                provider_list: updatedLlms
            }
        };

        if (fieldName === "api_key" && updatedLlms[llmIndex].provider === "Google") {
            dispatch(updateApiKey(event.target.value));
        }

        dispatch(saveConfig(updatedConfigData));
    };

    return (
        <div className="mx-0 p-1">
            <div className="text-xl mb-4">LLM 配置</div>
            {llms.map((llm, llmIndex) => (
                <div key={llmIndex} className="bg-white hover:bg-gray-200 shadow rounded p-4 mb-4 relative">
                    <div className="absolute top-2 right-2">
                        <input
                            type="radio"
                            id={`provider_${llmIndex}`}
                            name="single_only_radio"
                            checked={active_provider === llm.provider}
                            onChange={() => setActiveProvider(llm.provider)}
                            className="w-6 h-6 appearance-none rounded-full border border-gray-400 checked:bg-green-500"
                        />
                    </div>

                    <div className="mb-2">
                        <label htmlFor={`provider-${llmIndex}`} className="block font-bold text-gray-700">
                            供应商:
                        </label>
                        <label className={`text-lg text-[#ffffff] text-bold w-full p-1 rounded-xl bg-[${colorsData.bg_color}]`}>
                            {llm.provider}
                        </label>
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
                                <label className="border-none rounded mr-2 p-2 text-lg">{model}</label>
                                <input
                                    type="radio"
                                    id={`${llm.provider}_${model}`}
                                    name={`${llm.provider}_model`}
                                    checked={llm.active_model === model}
                                    onChange={() => handleModelChange(llmIndex, model)}
                                    className="w-5 h-5 appearance-none rounded-full border border-gray-400 checked:bg-green-500"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default LLMConfig;