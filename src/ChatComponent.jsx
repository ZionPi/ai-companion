import ChatItem from './ChatItem';
import InputBox from './InputBox';
// import { MessageListContext } from './MessageListContext';
import React, { useState,useEffect } from 'react';
import { useSelector } from 'react-redux';
import colorsData from './data/colors.json';
function ChatComponent() {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const messageList = useSelector(state => state.messages.messageList);

    const configData = useSelector(state => state.config.config);

    let scrollTimeout;

  // Detect scroll position and show/hide button accordingly
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowScrollButton(true);
            } else {
                setShowScrollButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);


    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });

        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Hide the scroll button after 2 seconds
        scrollTimeout = setTimeout(() => {
            setShowScrollButton(false);
        }, 1000);
    };

    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, []);




    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };


    return (<div className="flex flex-col mt-2 w-[360px] md:w-[800px] lg:w-[1340px] lg-relative ">
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
                <div className="ml-3">
                    <p className="text-xl font-medium">{configData.chat_mode.lead_clause}</p>
                    {/* <OnlineStatusIndicator />  */}
                    {/* <p className="text-gray-500">{configData.chat_mode.is_online}</p> */}
                </div>
            </div>


            {messageList.map(item => (
                <ChatItem key={item.id} item={item} />
            ))}

            <InputBox ></InputBox>

         {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className={`fixed bottom-24 right-6 bg-[${colorsData.bg_color}]  text-white font-bold py-2 px-4 rounded-full`}
                >
                    <svg  className='w-4 h-5' fill="none" strokeWidth={3} stroke={`${colorsData.fg_color}`}viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

            )}

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className={`mb-5 fixed bottom-32 right-6 bg-[${colorsData.bg_color}]  text-white font-bold py-2 px-4 rounded-full`}
                >
                    <svg className="w-4 h-5" fill="none" strokeWidth={3} stroke={`${colorsData.fg_color}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                    </svg>
                </button>
            )}

        </div>
    </div>);
}

export default ChatComponent;