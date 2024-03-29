import React, { useState, useEffect } from 'react';
import "./index.css";
import ChatComponent from './ChatComponent';
import SingleComponent from './SingleComponent';
import ErrorComponent from './ErrorComponent';
import OnlineStatusIndicator from './OnlineStatusIndicator';

function ConversationComponent() {

    const [viewMode, setViewMode] = useState('single');
    const [modeTitle, setModeTitle] = useState('搜寻');

    const quote = "Free software is not free beer. It is a matter of liberty ,not price."

    function toggleMode() {
        if (viewMode == "single") {
            setViewMode("chat");
            setModeTitle('聊天');
        }
        else if (viewMode == "chat") {
            setViewMode("single");
            setModeTitle('搜寻');
        }
        else
            setViewMode("error");

    }

    function scrollToBottom() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    function scrollToTop() {
        window.scrollTo(0, 0);
    }



    useEffect(() => {
        function handleKeyDown(e) {
            if (e.metaKey && e.key === 'x') {
                toggleMode();
                scrollToTop();
            }
            if (e.metaKey && e.key === '9') {
                scrollToBottom();
            }
            if (e.metaKey && e.key === '0') {
                scrollToTop();
            }
        }

        window.addEventListener('keydown', handleKeyDown);

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [viewMode]); // Re-run the effect when `viewMode` changes



    function renderContent() {
        switch (viewMode) {
            case "single":
                return <SingleComponent />;
            case "chat":
                return <ChatComponent />;
            default:
                return <ErrorComponent />;
        }
    }


    return (
        <div className='flex flex-col w-full mx-10 relative' >

            <div className="flex items-center justify-between gap-4 bg-indigo-600 px-4 py-3 text-white">
                {/* <p className="text-sm font-medium">
                    Love Alpine JS?
                    <a href="#" className="inline-block underline">Check out this new course!</a>
                </p> */}

                <h1 className='text-1xl font-medium text-lime-200'>{quote}</h1>

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

            <a className='flex justify-start rounded hover:text-gray-700' onClick={() => toggleMode()} >
                <span
                    className="mt-1 w-[68px] inline-flex items-center justify-center rounded-lg  bg-cyan-100 hover:bg-cyan-200 px-2.5 py-0.5 text-purple-700"
                >
                    <svg data-slot="icon" fill="none" strokeWidth="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5"></path>
                    </svg>

                    <p className="whitespace-nowrap text-sm">{modeTitle}</p>

                </span>
                <OnlineStatusIndicator />
            </a>

            <div>{renderContent()}</div>

        </div>
    );
}

export default ConversationComponent;
