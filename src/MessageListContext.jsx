// // MessageListContext.js
// import React, { useState, createContext, useEffect } from 'react';
// import configData from './data/config.json'

// export const MessageListContext = createContext();

// export const MessageListProvider = ({ children }) => {

//   const [messageList, setMessageList] = useState([]);

//   function saveMessageList() {
//     const jsonString = JSON.stringify(messageList);
//     localStorage.setItem(configData.message_list_key, jsonString);
//   }

//   function loadMessageList() {
//     const retrievedJsonString = localStorage.getItem(configData.message_list_key);
//     const ml = JSON.parse(retrievedJsonString);
//     setMessageList(ml || []);
//   }


//   useEffect(() => {
//     // 组件挂载时调用 loadMessageList 来初始化 messageList
//     loadMessageList();
//   }, []); // 空依赖数组意味着这个effect只会在组件挂载时运行一次

//   useEffect(() => {
//     saveMessageList(messageList);
//   }, [messageList]); // 当 messageList 更新时，执行 useEffect



//   return (
//     <MessageListContext.Provider value={{ messageList, setMessageList, saveMessageList, loadMessageList }}>
//       {children}
//     </MessageListContext.Provider>
//   );
// };
