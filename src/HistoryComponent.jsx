import React, { useState } from 'react';
import "./index.css";
import ListItem from './ListItem';
// Sample data
const dataList = [
    { id: 1, role: "user", name: 'Apple', desc: 'A sweet red fruit', imgUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8YXZhdGFyfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=800&q=60' },
    { id: 2, role: "user", name: 'Banana', desc: 'A long yellow fruit', imgUrl: 'banana.jpg' },
    { id: 3, role: "user", name: 'Cherry', desc: 'A small round stone fruit', imgUrl: 'cherry.jpg' },
    { id: 4, role: "ai", name: 'Date', desc: 'A sweet brown fruit', imgUrl: 'date.jpg' },
    { id: 5, role: "user", name: 'Elderberry', desc: 'A dark purple berry', imgUrl: 'elderberry.jpg' },
    { id: 6, role: "user", name: 'Fig', desc: 'A pear-shaped tropical fruit', imgUrl: 'fig.jpg' },
    { id: 7, role: "ai", name: 'Grape', desc: 'A small juicy fruit', imgUrl: 'grape.jpg' },
    { id: 8, role: "user", name: 'Honeydew', desc: 'A sweet melon', imgUrl: 'honeydew.jpg' },
    { id: 9, role: "user", name: 'Kiwi', desc: 'A small fruit with green flesh', imgUrl: 'kiwi.jpg' },
    { id: 10, role: "ai", name: 'Lemon', desc: 'A sour yellow citrus fruit', imgUrl: 'lemon.jpg' },
    { id: 11, role: "user", name: 'Mango', desc: 'A tropical stone fruit', imgUrl: 'mango.jpg' },
    { id: 12, role: "ai", name: 'Nectarine', desc: 'A smooth-skinned peach', imgUrl: 'nectarine.jpg' }

    // ... other items
];

function HistoryComponent() {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState(dataList);

    const handleChange = event => {
        const value = event.target.value;
        setSearchTerm(value);
        if (value !== '') {
            setSearchResults(dataList.filter(item =>
                item.name.toLowerCase().includes(value.toLowerCase()) ||
                item.desc.toLowerCase().includes(value.toLowerCase())
            ));
        } else {
            setSearchResults(dataList);
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
                <svg className='absolute right-3 w-5 h-5' dataSlot="icon" fill="none" strokeWidth={1.5} stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
            </div>

            <div className="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
                <button
                    className="inline-block rounded-md px-4 py-2 text-sm text-blue-500 bg-white hover:text-gray-700 focus:relative"
                >
                    全部
                </button>

                <button
                    className="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
                >
                    问题
                </button>

                <button
                    className="inline-block rounded-md  px-4 py-2 text-sm  text-gray-500 shadow-sm focus:relative"
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