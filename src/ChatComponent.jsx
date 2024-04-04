import ChatItem from './ChatItem';
import configData from './data/config.json'
import InputBox from './InputBox';
// import { MessageListContext } from './MessageListContext';
import React, { useContext } from 'react';
import { useSelector } from 'react-redux';

function ChatComponent() {

     const messageList = useSelector(state => state.messages.messageList);

    return (<div className="flex flex-col mt-2 w-[500px] md:w-[800px] lg:w-[1340px] lg-relative ">
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

        </div>
    </div>);
}

export default ChatComponent;