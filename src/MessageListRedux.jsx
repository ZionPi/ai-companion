// MessageList.js
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import configData from './data/config.json'

// Action Types
const SET_MESSAGE_LIST = 'SET_MESSAGE_LIST';
const DELETE_MESSAGE = 'DELETE_MESSAGE';
const UPDATE_MESSAGE = 'UPDATE_MESSAGE';
const CLEAR_MESSAGE_LIST = 'CLEAR_MESSAGE_LIST';

// Action Creators
const setMessageList = (messageList) => ({
  type: SET_MESSAGE_LIST,
  payload: messageList,
});

const deleteMessage = (id) => ({
  type: DELETE_MESSAGE,
  payload: id,
});

const updateMessage = (id, newMessage) => ({
  type: UPDATE_MESSAGE,
  payload: { id, newMessage },
});

const clearMessageList = () => ({
  type: CLEAR_MESSAGE_LIST,
});

// Reducer
const messageListReducer = (state = [], action) => {
  switch (action.type) {
    case SET_MESSAGE_LIST:
      return action.payload;
    case DELETE_MESSAGE:
      return state.filter(message => message.id !== action.payload);
    case UPDATE_MESSAGE:
      return state.map(message =>
        message.id === action.payload.id ? action.payload.newMessage : message
      );
    case CLEAR_MESSAGE_LIST:
      return [];
    default:
      return state;
  }
};

// Component
export const MessageList = ({ children }) => {
  const dispatch = useDispatch();
  const messageList = useSelector(state => state.messageList);

  function saveMessageList() {
    const jsonString = JSON.stringify(messageList);
    localStorage.setItem(configData.message_list_key, jsonString);
  }

  function loadMessageList() {
    const retrievedJsonString = localStorage.getItem(configData.message_list_key);
    const ml = JSON.parse(retrievedJsonString);
    dispatch(setMessageList(ml || []));
  }

  useEffect(() => {
    // 组件挂载时调用 loadMessageList 来初始化 messageList
    loadMessageList();
  }, []); // 空依赖数组意味着这个effect只会在组件挂载时运行一次

  useEffect(() => {
    saveMessageList();
  }, [messageList]); // 当 messageList 更新时，执行 useEffect

  return children;
};

export default messageListReducer;
