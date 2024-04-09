import { useState, useEffect } from "react";
import colorsData from './data/colors.json';
import {useDispatch, useSelector } from 'react-redux';
import { saveConfig } from './redux/slice/configSlice'; // Update the path to the actual location of your configSlice
import configDataDefault from './data/config.json';

function SettingComponent() {

    const dispatch = useDispatch();

    const configData = useSelector(state => state.config.config);

    const [serverAddress, setServerAddress] = useState(configData.service_url);

    const [userName, setUsername] = useState(configData.user_name);

    const [secretKey, setSecretKey] = useState(configData.secret_key);

    const [warningNumber, setWarningNumber] = useState(configData.warning_number);

    const [mode, setMode] = useState(configData.mode);

    const save_config = () => {
        // Create a new object with updated values
        const updatedConfigData = {
            ...configData,
            service_url: serverAddress,
            user_name: userName,
            secret_key: secretKey,
            warning_number: warningNumber,
            mode: mode,
        };

         dispatch(saveConfig(updatedConfigData));
    };

    const reset_config = () => {
        setServerAddress(configDataDefault.service_url);
        setUsername(configDataDefault.user_name);
        setSecretKey(configDataDefault.secret_key);
        setWarningNumber(configDataDefault.warning_number);
        setMode(configDataDefault.mode);
    };

    return (
        <div className="w-full">
            <div className="flex items-center justify-center p-12">

                <div className="mx-auto w-full max-w-[550px]">
                    <div >
                        <div className="-mx-3 flex flex-wrap">
                            <div className="w-full px-3 sm:w-4/4">
                                <div className="mb-2">
                                    <label
                                        htmlFor="fName"
                                        className="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        用户名
                                    </label>
                                    <input
                                        type="text"
                                        name="fName"
                                        id="fName"
                                        value={userName}
                                        placeholder="用户名"
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="text-[#07074D] border-none w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>


                            <div className="w-full px-3 sm:w-4/4">
                                <div className="mb-5">
                                    <label
                                        htmlFor="fName"
                                        className="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        邮箱
                                    </label>
                                    <input
                                        type="text"
                                        name="fName"
                                        id="fName"
                                        placeholder="邮箱"
                                        onChange={(e) => setServerAddress(e.target.value)}
                                        className="border-none w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#07074D]  outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>



                            <div className="w-full px-3 sm:w-3/4">
                                <div className="mb-5">
                                    <label
                                        htmlFor="fName"
                                        className="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        服务器地址
                                    </label>
                                    <input
                                        type="text"
                                        name="fName"
                                        id="fName"
                                        value={serverAddress}
                                        placeholder="输入服务器信息"
                                        onChange={(e) => setServerAddress(e.target.value)}
                                        className="border-none w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#07074D]  outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                            <div className="w-full px-3 sm:w-1/4">
                                <div className="mb-5">
                                    <label
                                        htmlFor="lName"
                                        className="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        密钥
                                    </label>
                                    <input
                                        type="text"
                                        name="lName"
                                        id="lName"
                                        value={secretKey}
                                        placeholder="输入密钥"
                                        onChange={(e) => setSecretKey(e.target.value)}
                                        className="border-none w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#07074D]  outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                        </div>


                        <div className="mb-5">
                            <label className="mb-3 block text-base font-medium text-[#07074D]">
                                默认交互模式
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="radio1"
                                        id="radioButton1"
                                        checked={mode === "single"}
                                        onChange={() => setMode("single")}
                                        className={`h-5 w-5  appearance-none rounded-full border border-gray-300 checked:bg-[${colorsData.fg_color}] `}
                                    />
                                    <label
                                        htmlFor="radioButton1"
                                        className="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        搜寻
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="radio1"
                                        id="radioButton2"
                                        checked={mode === "chat"}
                                        onChange={() => setMode("chat")}
                                        className={`h-5 w-5  appearance-none rounded-full border border-gray-300 checked:bg-[${colorsData.fg_color}] `}
                                    />
                                    <label
                                        htmlFor="radioButton2"
                                        className="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        聊天
                                    </label>
                                </div>
                            </div>
                        </div>


                        <div className="mb-5">
                            <label
                                htmlFor="guest"
                                className="mb-3 block text-base font-medium text-[#07074D]"
                            >
                                预警阈值
                            </label>
                            <input
                                type="number"
                                name="guest"
                                id="guest"
                                placeholder="90"
                                value={warningNumber}
                                onChange={(e) => setWarningNumber(e.target.value)}
                                min="0"
                                className="border-none w-full appearance-none rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#07074D]  outline-none focus:border-[#6A64F1] focus:shadow-md"
                            />
                        </div>



                        <div className="mb-5">
                            <label className="mb-3 block text-base font-medium text-[#07074D]">
                                订阅模式
                            </label>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="subscription_radio"
                                        id="fee_radio1"
                                        className={`h-5 w-5  appearance-none rounded-full border border-gray-300 checked:bg-[${colorsData.fg_color}] `}
                                    />
                                    <label
                                        htmlFor="fee_radio1"
                                        className="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        免费
                                    </label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="subscription_radio"
                                        id="fee_radio2"
                                        className={`h-5 w-5  appearance-none rounded-full border border-gray-300 checked:bg-[${colorsData.fg_color}] `}
                                    />
                                    <label
                                        htmlFor="fee_radio2"
                                        className="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        月付
                                    </label>
                                </div>

                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="subscription_radio"
                                        id="fee_radio3"
                                        className={`h-5 w-5  appearance-none rounded-full border border-gray-300 checked:bg-[${colorsData.fg_color}] `}
                                    />
                                    <label
                                        htmlFor="fee_radio3"
                                        className="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        年付
                                    </label>
                                </div>


                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        name="subscription_radio"
                                        id="fee_radio4"
                                        className={`h-5 w-5  appearance-none rounded-full border border-gray-300 checked:bg-[${colorsData.fg_color}] `}
                                    />
                                    <label
                                        htmlFor="fee_radio4"
                                        className="pl-3 text-base font-medium text-[#07074D]"
                                    >
                                        终身
                                    </label>
                                </div>


                            </div>
                        </div>


                        <div className="-mx-3 flex flex-wrap hidden">
                            <div className="w-full px-3 sm:w-1/2">
                                <div className="mb-5">
                                    <label
                                        htmlFor="date"
                                        className="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        name="date"
                                        id="date"
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#07074D]  outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                            <div className="w-full px-3 sm:w-1/2">
                                <div className="mb-5">
                                    <label
                                        htmlFor="time"
                                        className="mb-3 block text-base font-medium text-[#07074D]"
                                    >
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        name="time"
                                        id="time"
                                        className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#07074D]  outline-none focus:border-[#6A64F1] focus:shadow-md"
                                    />
                                </div>
                            </div>
                        </div>



                        <div className="flex justify-end ">

                            <button
                                className={`mr-5 hover:shadow-form rounded-md bg-[${colorsData.bg_color}] py-3 px-8 text-center text-base font-semibold text-white outline-none`}
                                onClick={reset_config}
                            >
                                重置
                            </button>

                            <button
                                className={`hover:shadow-form rounded-md bg-[${colorsData.bg_color}] py-3 px-8 text-center text-base font-semibold text-white outline-none`}
                                onClick={save_config}
                            >
                                保存
                            </button>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default SettingComponent;