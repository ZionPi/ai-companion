import React, { useState, useContext } from 'react';
import "./index.css";
import ListItem from './ListItem';
import { useSelector, useDispatch } from 'react-redux';

function HistoryComponent() {

    const messageList = useSelector(state => state.messages.messageList);

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(messageList);

    const [activeTab, setActiveTab] = useState('全部');

    const handleButtonClick = (tab) => {
        console.log(`选中了: ${tab}`);
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
            setSearchResults(messageList.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.desc.toLowerCase().includes(value.toLowerCase())
            ));
        } else {
            setSearchResults(messageList);
        }
    };

    return (
        <div className='flex flex-col w-full mx-4 items-center bg-white'>

            <div className='relative flex items-center m-4'>
                <input
                    className='pl-3 w-[1040px] h-12 '
                    type="text"
                    placeholder="Search..."
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



            <ul className='w-4/5  mt-5 '>
                {searchResults.map(item => (
                    <li className='m-3' key={item.id}>
                        <ListItem item={item} />
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default HistoryComponent;