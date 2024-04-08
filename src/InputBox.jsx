
import React, { useState, useEffect } from 'react';
import "./index.css";
import AlertComponent from './AlertComponent';
import { useFetchAnswerQuery } from './redux/slice/answerSlice';


function InputBox() {
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');
    const [message, setMessage] = useState('');

    // const messageList = useSelector(state => state.messages.messageList);
    
    const [executeQuery, setExecuteQuery] = useState(false);

    const [queryMessage, setQueryMessage] = useState(''); // new state variable

    const { refetch } = useFetchAnswerQuery(queryMessage, { skip: !executeQuery });


    useEffect(() => {
        if (executeQuery) {
            refetch().finally(() => {setExecuteQuery(false);}); // set loading to false when refetch ends
        }
    }, [executeQuery, refetch]);




    const handleKeyDown = async (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (message === "") {
                setShowAlert(true);
                console.log('setShowAlert', "setShowAlert has been called.");
                setAlertMsg("输入框为空");
                return;
            }

            ask();
        }
    }

    const ask = () => {
        setQueryMessage(message); // set the queryMessage state when '发送' button is clicked
        setExecuteQuery(true);
    }

    return (
        <>
            <div className='flex items-center justify-center '>
                <AlertComponent message={alertMsg} isVisible={showAlert} />
            </div>
           
            <div className='mt-4'>
                <textarea
                    className='border-2 border-[#00d0a7] mt-1 w-full h-auto min-h-250 rounded-lg outline-none pl-2 pt-2 text-2xl resize-none overflow-auto'
                    id='question_box'
                    placeholder="输入聊天内容"
                    value={message}
                    onKeyDown={handleKeyDown}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <div className='flex justify-end  mb-5' >
                <button className="mt-1 w-20  h-10 hover:bg-[#00d0a7]" onClick={ask}>发送</button>
            </div>
        </>
    );
}

export default InputBox;
