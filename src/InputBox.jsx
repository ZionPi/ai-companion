import React, { useState, useEffect } from 'react';
import "./index.css";
import configData from './data/config.json'
import {  v4 as uuidv4 } from 'uuid';
import LoadingComponent from './Loading';
import AlertComponent from './AlertComponent';
import { useSelector, useDispatch } from 'react-redux';
import { setAnswer } from './answerSlice';

function InputBox() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [message, setMessage] = useState('');
    const generateUniqueId = () => uuidv4();
    const target_service = configData.service_url;
    const messageList = useSelector(state => state.messages.messageList);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    var system_msg_id = -1;

    const answer = useSelector((state) => state.answer.answer);

    useEffect(() => {
        if(answer && system_msg_id !== -1)
            dispatch({ type: 'UPDATE_SINGLE_MESSAGE', payload: { system_msg_id, desc: answer } });
    }, [answer]);

    function getMsg(_id, role, name, msg, img) {
        const newMessage = {
            id: _id,
            role: role,
            name: name,
            desc: msg,
            imgUrl: img,
            timestamp: new Date().toISOString()
        };
        return newMessage;
    }


    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message === "") {
                setShowAlert(true);
                setAlertMsg("输入框为空");
                return;
            }
            
            const user_msg_id = generateUniqueId();
            const t = getMsg(user_msg_id,"user", configData.user_name, message, configData.user_img_url);
            var updatedMessageList = [...messageList, t];
            dispatch({ type: 'UPDATE_MESSAGE_LIST', payload: updatedMessageList });

            ask();
        }
    }

    async function ask() {
        try {

            setIsLoading(true);
            // 创建 sysMsg 并添加到 messageList
            system_msg_id = generateUniqueId();
            const sysMsg = getMsg(system_msg_id, "system", configData.model_name, "", configData.model_img_url);
            const updatedMessageList = [...messageList, sysMsg];
            dispatch({ type: 'UPDATE_MESSAGE_LIST', payload: updatedMessageList });

            fetch(target_service, {
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
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(response => {
                const reader = response.body.getReader();
                reader.read().then(function processText({ done, value }) {
                    if (done) {
                        console.log('Stream complete done');
                        setIsLoading(false);
                        return;
                    }
                    const rawJsonString = new TextDecoder().decode(value);
                    const dataStringList = rawJsonString.split("data:");
                    for (let i = 1; i < dataStringList.length; i++) {
                        const c = dataStringList[i];
                        if (c.trim() === '[DONE]') {
                            console.log('Stream complete data: [DONE] ');
                            setIsLoading(false);
                        } else {
                            try {
                                const json = JSON.parse(c);
                                const content = json.choices[0].message.content;
                                // console.log("content",content);
                             
                                dispatch(setAnswer(content));
                            } catch (e) {
                                console.log('Error parsing JSON:', e);
                            }
                        }
                    }
                    return reader.read().then(processText);
                });
            }).catch(error => {
                console.error(error);
            });
        } catch (error) {
            console.error('There was an error!', error);
        }
    }

    return (
        <>
            <div className='flex items-center justify-center '>
                <AlertComponent message={alertMsg} isVisible={showAlert} />
            </div>
            <LoadingComponent isLoading={isLoading} />
            <div className='mt-0'>
                <textarea
                    className='mt-1 w-full h-auto min-h-250 rounded-lg outline-none pl-2 pt-2 text-2xl resize-none overflow-auto'
                    id='question_box'
                    placeholder="输入聊天内容"
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <div className='flex justify-end  mb-5' >
                <button className="mt-1 w-20  h-10 hover:bg-red-300" onClick={ask}>发送</button>
            </div>
        </>
    );
}

export default InputBox;
