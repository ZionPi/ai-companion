import React, { useState } from 'react';
import configData from './data/config.json'
import Markdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import remarkGfm from 'remark-gfm'
import LoadingComponent from './Loading';
import ContextMenu from './components/menu/ContextMenu'

const ChatItem = ({ item }) => {

    const [showMenu, setShowMenu] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (event) => {
        event.preventDefault();
        setPosition({ x: event.pageX, y: event.pageY });
        setShowMenu(true);
    };

    const handleClick = () => {
        setShowMenu(false);
    };

    const handleDelete = (item) => {
        console.log('Item deleted:',item);
        // Add your delete logic here
        setShowMenu(false);
    };


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
            <div className="space-y-4 m-4"
                onContextMenu={handleContextMenu}
                onClick={handleClick}
            >
                  {showMenu && (
                    <div
                        style={{ top: position.y, left: position.x }}
                        className="fixed inset-0 z-50"
                        onClick={handleClick}
                    >
                        <ContextMenu onDelete={handleDelete(item)} />
                    </div>
                )}

                <div className="flex items-start">
                    <img src={item.imgUrl} alt="Other User Avatar" className="w-8 h-8 rounded-full ml-3" />

                    <div className="ml-3 bg-gray-100 p-2 rounded-lg group">
                     
                        <LoadingComponent isLoading={item.isLoading} />
                        <Markdown
                            remarkPlugins={[remarkGfm]}
                            className="text-sm md:text-lg lg:text-xl text-gray-800 mt-1 w-full resize-none md:text-1xl h-auto min-h-2 outline-none border-blue-200 align-top  overflow-auto  "
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
                        className={`mr-4 p-2 text-sm md:text-lg lg:text-xl opacity-0 group-hover:opacity-100 transition-opacity ease-in-out duration-300 ${copyText === '已复制' ? 'text-green-500' : 'text-blue-500'
                            }`}
                    >
                        {copyText}
                    </button>
                    <div className="bg-red-200 p-3 rounded-lg">
                        <p className="text-sm md:text-lg lg:text-xl text-black">{item.desc}</p>
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
