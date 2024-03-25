import React, { useState } from 'react';
import "./index.css";
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'
import LoadingComponent from './Loading';
import AlertComponent from './AlertComponent';

function ChatRoom() {
    const [message, setMessage] = useState('');
    const [answer, setAnswer] = useState('');
    const [showAlert, setShowAlert] = useState(false);
    const [alertMsg, setAlertMsg] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const target_service = 'http://127.0.0.1:7077/v1/chat/completions';

      // 处理KeyDown事件
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 防止Enter默认行为
            ask(); // 如果没有按Shift，调用ask函数发送消息
        } else if (e.key === 'Enter' && e.shiftKey) {
            // 如果同时按下Shift和Enter，允许换行
            setMessage(message);
        }
    }


    async function ask() {
        try {
            if(message === "") {
                setShowAlert(true);    
                setAlertMsg("输入框为空");
                return ;
            }
            // setMessage("");
            setIsLoading(true);
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
                        console.log('Stream complete');
                        setIsLoading(false);
                        return;
                    }
                    const jsonString = new TextDecoder().decode(value);
                    if (jsonString.trim() === 'data: [DONE]') {
                        console.log('Stream complete');
                        setIsLoading(false);
                    } else if (jsonString.startsWith('data:')) {
                        try {
                            const json = JSON.parse(jsonString.substring(6));
                            // Access the content value
                            const content = json.choices[0].message.content;
                            setAnswer(content);
                            // setMarkdown(content);
                            console.log(jsonString);
                        } catch (e) {
                            console.log('Error parsing JSON:', e);

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
        <div className='flex flex-col w-full mx-10 relative' >
            <div className='flex items-center justify-center '>
                <AlertComponent message={alertMsg} isVisible={showAlert} />
            </div>

            <div className="flex items-center justify-between gap-4 bg-indigo-600 px-4 py-3 text-white">
                {/* <p className="text-sm font-medium">
                    Love Alpine JS?
                    <a href="#" className="inline-block underline">Check out this new course!</a>
                </p> */}

                <h1 className='text-1xl font-medium text-lime-200'>Free software is not free beers.</h1>

                <button
                    aria-label="Dismiss"
                    className="shrink-0 rounded-lg bg-black/10 p-1 transition hover:bg-black/20"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </button>
            </div>
           

            {/* <span className="ml-4 mb-2 w-10 h-5  whitespace-nowrap rounded-full bg-purple-100  text-purple-700"> Live </span> */}
            {/* <div className='ml-4  w-16 h-7 px-1.5 py-0.5  bg-cyan-100 rounded-lg' >聊天页</div> */}


            <span
                className="mt-2 w-20 h-7 inline-flex items-center justify-center rounded-lg  bg-cyan-100 px-2.5 py-0.5 text-purple-700"
            >
                <svg  data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path>
                </svg>

                <p className="whitespace-nowrap text-sm">聊天页</p>
            </span>


            <div className=''>

                <Markdown
                    remarkPlugins={[remarkGfm]}
                    className="bg-orange-100 mt-1 w-full resize-none md:text-1xl h-auto min-h-250 pl-2 pt-2 rounded-lg outline-none border-blue-200 align-top shadow-sm overflow-auto  "
                    children={answer}
                    components={{
                        code(props) {
                            const { children, className, node, ...rest } = props
                            const match = /language-(\w+)/.exec(className || '')
                            return match ? (
                                <div style={{ position: 'relative' }}>
                                    <SyntaxHighlighter
                                        {...rest}
                                        PreTag="div"
                                        children={String(children).replace(/\n$/, '')}
                                        language={match[1]}
                                        style={dark}
                                    />
                                    <CopyToClipboard text={String(children).replace(/\n$/, '')}>
                                        <button style={{ position: 'absolute', right: '10px', top: '5px', color: '#ffffff' }}>
                                            Copy
                                        </button>
                                    </CopyToClipboard>
                                </div>

                            ) : (
                                <code {...rest} className={className}>
                                    {children}
                                </code>
                            )
                        }
                    }}
                />

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


        </div>
    );
}

export default ChatRoom;
