import ChatItem from './ChatItem';
import InputBox from './InputBox';
// import { MessageListContext } from './MessageListContext';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import colorsData from './data/colors.json';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import AutoSizer from 'react-virtualized-auto-sizer';
function ChatComponent() {
    const [showScrollButton, setShowScrollButton] = useState(false);

    const messageList = useSelector(state => state.messages.messageList);

    const configData = useSelector(state => state.config.config);

    const scrollableContainerRef = useRef(null);

    const listRef = useRef();
    // Create a new instance of CellMeasurerCache
    const cache = new CellMeasurerCache({
        fixedWidth: true, // Set to true if your list's width is fixed
        defaultHeight: 100, // Provide a default height for the cells
    });




    // The Row component that will be rendered for each item in the list
    const Row = ({ index, key, parent, style }) => (
        <CellMeasurer
            cache={cache}
            columnIndex={0}
            key={key}
            parent={parent}
            rowIndex={index}
        >
            {({ measure }) => (
                <div style={style}>
                    {/* You must call measure after the content has been rendered */}
                    <div onLoad={measure}>
                        <ChatItem item={messageList[index]} />
                    </div>
                </div>
            )}
        </CellMeasurer>
    );



    // Pass the height and width to the List component
    const renderList = useCallback(({ height, width }) => (
        <List
            width={width}
            height={height}
            ref={listRef}
            deferredMeasurementCache={cache} // Pass the cache instance to the List
            rowHeight={cache.rowHeight} // Tell the List how to get each row's height
            rowRenderer={Row} // Provide the Row component
            rowCount={messageList.length} // The number of items in the list
            onScroll={({ scrollTop }) => {
                // Check if the scroll position is greater than a certain threshold
                if (scrollTop > 200) {
                    setShowScrollButton(true);
                } else {
                    setShowScrollButton(false);
                }
            }}
            overscanRowCount={2} // How many rows to render above/below the visible area
        />
    ), [messageList,messageList.length]);

  

   

    // // Detect scroll position and show/hide button accordingly
    // useEffect(() => {
    //     const handleScroll = () => {

    //         console.log("showScrollButton",showScrollButton);
    //         // Make sure the ref is attached to the element
    //         if (scrollableContainerRef.current) {
    //             // Use scrollTop to get the scroll position of the container
    //             if (scrollableContainerRef.current.scrollTop > 200) {
    //                 setShowScrollButton(true);
    //             } else {
    //                 setShowScrollButton(false);
    //             }
    //         }
    //     };

    //     // Attach the event listener to the scrollable container
    //     const scrollableElement = scrollableContainerRef.current;
    //     if (scrollableElement) {
    //         scrollableElement.addEventListener('scroll', handleScroll);
    //     }

    //     // Clean up the event listener when the component is unmounted
    //     return () => {
    //         if (scrollableElement) {
    //             scrollableElement.removeEventListener('scroll', handleScroll);
    //         }
    //     };
    // }, [scrollableContainerRef]); // Empty dependency array ensures this effect runs only once after the initial render


    let scrollTimeout;

    const scrollToTop = () => {
        // Using the 'scrollToRow' method of the List to scroll to the top
        if (listRef.current) {
            listRef.current.scrollToRow(0);
        }
    };

    const scrollToBottom = () => {
        // Assuming 'data' is the array of items you're rendering in the List
        const lastIndex = messageList.length - 1;

        // Using the 'scrollToRow' method of the List to scroll to the bottom
        if (listRef.current) {
            listRef.current.scrollToRow(lastIndex);
        }

        // Clear any existing timeout
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }

        // Hide the scroll button after 2 seconds
        scrollTimeout = setTimeout(() => {
            setShowScrollButton(false);
        }, 2000);
    };


    const onAsk = () => {
        if (listRef.current) {
            const totalHeight = listRef.current.getOffsetForRow({ index: messageList.length - 1 });
            listRef.current.scrollToPosition(totalHeight);
        }
    }


    // Cleanup timeout on component unmount
    useEffect(() => {
        return () => {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
        };
    }, []);







    return (<div className="flex flex-col mt-2 w-[360px] md:w-[800px] lg:w-[1340px] lg-relative ">
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center mb-4">
                <div className="ml-3">
                    <p className="text-xl font-medium">{configData.chat_mode.lead_clause}</p>
                </div>
            </div>


            <div className="flex-1 relative" style={{ minHeight: '800px' }} ref={scrollableContainerRef}> {/* Ensure minimum height */}
                <AutoSizer>
                    {renderList}
                </AutoSizer>
            </div>


            <InputBox onAsk = {onAsk}></InputBox>

            {showScrollButton && (
                <button
                    onClick={scrollToBottom}
                    className={`absolute top-80 right-16 bg-[${colorsData.bg_color}]  text-white font-bold py-2 px-4 rounded-full`}
                >
                    <svg className='w-4 h-5' fill="none" strokeWidth={3} stroke={`${colorsData.fg_color}`} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </button>

            )}

            {showScrollButton && (
                <button
                    onClick={scrollToTop}
                    className={`absolute top-64 right-16 bg-[${colorsData.bg_color}]  text-white font-bold py-2 px-4 rounded-full`}
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