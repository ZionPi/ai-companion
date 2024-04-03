import React, { useState } from 'react';
import configData from './data/config.json'
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'
import LoadingComponent from './Loading';

const ChatItem = ({ item }) => {

    const [copyText, setCopyText] = useState('复制');

    const handleCopy = () => {
        navigator.clipboard.writeText(item.desc);
        setCopyText('已复制');
        setTimeout(() => setCopyText('复制'), 2000); // Reset the text back to 'Copy' after 2 seconds
    };


    if (item.role === 'system') {
        // if (item.desc === "") return;
        if (item.imgUrl === "path/to/image.jpg") {
            item.imgUrl = configData.model_img_url;
        }
        return (
            <div className="space-y-4 m-4">
                <div className="flex items-start">
                    <img src={item.imgUrl} alt="Other User Avatar" className="w-8 h-8 rounded-full ml-3" />

                    <div className="ml-3 bg-gray-100 p-2 rounded-lg group">
                     
                        <LoadingComponent isLoading={item.isLoading} />
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            className="text-sm text-gray-800 mt-1 w-full resize-none md:text-1xl h-auto min-h-2 outline-none border-blue-200 align-top shadow-sm overflow-auto  "
                            children={item.desc}
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
                </div>
            </div>
        );
    } else if (item.role === 'user') {
        if (item.imgUrl === "path/to/image.jpg") {
            item.imgUrl = configData.user_img_url;
        }
        return (
            <div className="space-y-4 m-4">

                <div className="flex items-end justify-end group">
                    <button
                        onClick={handleCopy}
                        className={`mr-4 p-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 ${copyText === '已复制' ? 'text-green-500' : 'text-blue-500'
                            }`}
                    >
                        {copyText}
                    </button>
                    <div className="bg-red-200 p-3 rounded-lg">
                        <p className="text-sm text-black">{item.desc}</p>
                    </div>
                    <img src={item.imgUrl} alt="Other User Avatar" className="w-8 h-8 rounded-full ml-3" />
                </div>
            </div>

        );
    } else {
        return null;
    }
};

export default ChatItem;
