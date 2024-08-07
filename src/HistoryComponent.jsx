import React, { useState, useContext,useCallback ,useRef,useEffect} from 'react';
import "./index.css";
import ListItem from './ListItem';
import { useSelector, useDispatch } from 'react-redux';
import { List, CellMeasurer, CellMeasurerCache } from 'react-virtualized';
import AutoSizer from 'react-virtualized-auto-sizer';

function HistoryComponent() {

    const messageList = useSelector(state => state.messages.messageList);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(messageList);

    const [activeTab, setActiveTab] = useState('全部');

    const listRef = useRef();
    // Create a new instance of CellMeasurerCache
    const cache = new CellMeasurerCache({
        fixedWidth: true, // Set to true if your list's width is fixed
        defaultHeight: 300, // Provide a default height for the cells
    });


    useEffect(() => {
        setSearchResults(messageList);
    }, [messageList]); 


    const handleButtonClick = (tab) => {
        // console.log(`选中了: ${tab}`);
        setActiveTab(tab);
        if(tab == '全部') {
            setSearchResults(messageList);
        } else if(tab == "问题") {
            setSearchResults(messageList.filter(item =>
                item.role.toLowerCase().includes("user") 
            ));

        } else if(tab == "答案") {
            setSearchResults(messageList.filter(item =>
               item.role.toLowerCase().includes("system") 
            ));
        }
    };


    const handleChange = event => {
        const value = event.target.value;

        setSearchTerm(value);

        if (value !== '') {
            setSearchResults(messageList.filter(item => {
                // Safe check for item.desc existence and type
                const descMatch = item.desc && typeof item.desc === 'string'
                    ? item.desc.toLowerCase().includes(value.toLowerCase())
                    : false;
                return item.name.toLowerCase().includes(value.toLowerCase()) || descMatch;
            }));
        } else {
            setSearchResults(messageList);
        }
    };

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
                    <div onLoad={measure} >

                        <ListItem item={searchResults[index]} />

                    </div>
                </div>
            )}
        </CellMeasurer>
    );


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

   // Pass the height and width to the List component
    const renderList = useCallback(({ height, width }) => (
        <List
            width={width}
            height={height}
            ref={listRef}
            deferredMeasurementCache={cache} // Pass the cache instance to the List
            rowHeight={cache.rowHeight} // Tell the List how to get each row's height
            rowRenderer={Row} // Provide the Row component
            rowCount={searchResults.length} // The number of items in the list
           
            // onScroll={({ scrollTop }) => {
            //     // Check if the scroll position is greater than a certain threshold
            //     if (scrollTop > 200) {
            //         setShowScrollButton(true);
            //     } else {
            //         setShowScrollButton(false);
            //     }
            // }}
            overscanRowCount={2} // How many rows to render above/below the visible area
        />
    ), [searchResults,searchResults.length]);

    return (
        <div className='flex flex-col  w-full  mx-4 items-center bg-white'>

            <div className='relative flex items-center m-4'>
                <input
                    className='text-sm md:text-lg lg:text-xl w-[400px] md:w-[600px] lg:w-[900px] pl-3  h-12 '
                    type="text"
                    placeholder="查找关键词..."
                    value={searchTerm}
                    onChange={handleChange}
                />
                <svg className='absolute right-3 w-5 h-5' fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
                <button
                    className={`inline-block rounded-md px-4 py-2 text-sm ${activeTab === '全部' ? 'text-blue-500 bg-white' : 'text-gray-500'
                        } hover:text-gray-700 focus:relative`}
                    onClick={() => handleButtonClick('全部')}
                >
                    全部
                </button>

                <button
                    className={`inline-block rounded-md px-4 py-2 text-sm ${activeTab === '问题' ? 'text-blue-500 bg-white' : 'text-gray-500'
                        } hover:text-gray-700 focus:relative`}
                    onClick={() => handleButtonClick('问题')}
                >
                    问题
                </button>

                <button
                    className={`inline-block rounded-md px-4 py-2 text-sm ${activeTab === '答案' ? 'text-blue-500 bg-white' : 'text-gray-500'
                        } shadow-sm focus:relative`}
                    onClick={() => handleButtonClick('答案')}
                >
                    答案
                </button>
            </div>



        <div className="flex-1 relative w-[360px] md:w-[800px] lg:w-[1340px] lg-relative" style={{ minHeight: '800px' }} > {/* Ensure minimum height */}
              <AutoSizer>
                    {renderList}
                </AutoSizer>
            </div>


            {/* <ul className='w-4/5 md:w-4/5  mt-5 '>
               
               

            </ul> */}
        </div>
    );
}


export default HistoryComponent;
