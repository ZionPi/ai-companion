import React, { useState, useEffect,useRef } from 'react';
import "./index.css";
import AlertComponent from './AlertComponent';
import { useFetchGoogleAnswerQuery, useFetchAnswerQuery } from './redux/slice/answerSlice';

function InputBox() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [message, setMessage] = useState('');

    const [executeQuery, setExecuteQuery] = useState(false);
    const [executeQueryGoogle, setExecuteQueryGoogle] = useState(false);
    const [queryMessage, setQueryMessage] = useState('');

    const { refetch: refetchAnswer } = useFetchAnswerQuery(queryMessage, { skip: !executeQuery });
    const { refetch: refetchGoogleAnswer } = useFetchGoogleAnswerQuery(queryMessage, { skip: !executeQueryGoogle });

    const contentEditableRef = useRef(null);

    const [imageFile, setImageFile] = useState(null); // State to store the image file

    useEffect(() => {
        if (executeQuery) {
            refetchAnswer().finally(() => setExecuteQuery(false));
        }
        if (executeQueryGoogle) {
            refetchGoogleAnswer().finally(() => setExecuteQueryGoogle(false));
        }
    }, [executeQuery, executeQueryGoogle, refetchAnswer, refetchGoogleAnswer]);

    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!message.trim()) {
                setShowAlert(true);
                setAlertMsg("输入框为空");
                return;
            }
            ask();
        }
    };

    const ask = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setQueryMessage(message);
        setExecuteQueryGoogle(true);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const items = e.dataTransfer.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file') {
                const file = items[i].getAsFile();
                setImageFile(file);
                const reader = new FileReader();
                reader.onload = (event) => {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    img.style.maxWidth = '20px';
                    img.style.height = '20px';
                    document.getElementById('editable').appendChild(img);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleInput = (e) => {
        const html = contentEditableRef.current.innerHTML;
        setMessage(html);
    };

    return (
        <>
            <div className='flex items-center justify-center'>
                <AlertComponent message={alertMsg} isVisible={showAlert} />
            </div>
            <div className='mt-4'>
                <div
                    className='border-2 border-[#00d0a7] mt-1 w-full h-auto min-h-250 rounded-lg outline-none pl-2 pt-2 text-2xl resize-none overflow-auto'
                    id='editable'
                    contentEditable
                    placeholder="输入聊天内容"
                    onInput={handleInput}
                    onKeyDown={handleKeyDown}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    ref={contentEditableRef}
                ></div>
            </div>
            <div className='flex justify-end mb-5'>
                <button className="mt-1 w-20 h-10 hover:bg-[#00d0a7]" onClick={ask}>发送</button>
            </div>
        </>
    );
}

export default InputBox;
