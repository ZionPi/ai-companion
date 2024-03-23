import React, { useState } from 'react';
import "./index.css";
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'
function ChatRoom() {
    const [message, setMessage] = useState('');
    const [answer, setAnswer] = useState('');

    const CodeBlock = ({ language, value }) => {
        return (
            <div style={{ position: 'relative' }}>
                <SyntaxHighlighter style={dark} language={language}>
                    {value}
                </SyntaxHighlighter>
                <CopyToClipboard text={value}>
                    <button style={{ position: 'absolute', right: '8px', top: '5px' }}>
                        Copy
                    </button>
                </CopyToClipboard>
            </div>
        );
    };



    const target_service = 'http://127.0.0.1:7077/v1/chat/completions';

    async function ask() {
        try {
            console.log("message", message);
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
                        return;
                    }
                    const jsonString = new TextDecoder().decode(value);
                    if (jsonString.trim() === 'data: [DONE]') {
                        console.log('Stream complete');
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
        <div className='flex flex-col justify-center w-100' >
            <h1 className='text-4xl font-bold text-orange-500'>Let's build something cool.</h1>

            {/* <span className="ml-4 mb-2 w-10 h-5  whitespace-nowrap rounded-full bg-purple-100  text-purple-700"> Live </span> */}
            <div className='ml-4  w-16 h-7 px-1.5 py-0.5  bg-cyan-100 rounded-lg' >聊天页</div>
            <div className='mt-0'>
                <textarea
                    className='mx-4 w-full h-auto min-h-250 rounded-lg outline-none pl-2 pt-2 text-2xl resize-none overflow-auto'
                    id='question_box'
                    placeholder="输入聊天内容"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                ></textarea>
            </div>
            <div className=''>
                {/* <textarea
                    id='answer_box'
                    className="mt-2 mx-4 w-full resize-none md:text-1xl h-250 pl-2 pt-2 rounded-lg outline-none border-gray-200 align-top shadow-sm overflow-auto  bg-green-200 "
                    rows="4"
                    placeholder="回复的内容"
                    value={answer} // 绑定answer状态到textarea
                    onChange={(e) => setAnswer(e.target.value)}
                ></textarea> */}

                {/* <ReactMarkdown components={{ code: CodeBlock }} className=" mt-2 mx-4 w-full resize-none md:text-1xl h-250 pl-2 pt-2 rounded-lg outline-none border-gray-200 align-top shadow-sm overflow-auto  ">{answer}</ReactMarkdown> */}


                <Markdown
                    remarkPlugins={[remarkGfm]}
                    className="bg-orange-100 mt-2 mx-4 w-full resize-none md:text-1xl h-auto min-h-250 pl-2 pt-2 rounded-lg outline-none border-blue-200 align-top shadow-sm overflow-auto  "
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
            <div className=''>
                <button className="ml-4 mt-5 w-20  h-10 hover:bg-red-300" onClick={ask}>确定</button>
            </div>


        </div>
    );
}

export default ChatRoom;
