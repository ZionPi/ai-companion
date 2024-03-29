import { configureStore } from '@reduxjs/toolkit';
import configData from './data/config.json';
import answerReducer from './answerSlice';


const initialState = {
  messageList: JSON.parse(localStorage.getItem(configData.message_list_key)) || [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'UPDATE_MESSAGE_LIST':
      const t = JSON.stringify(action.payload);
      console.log("t",t);
      localStorage.setItem(configData.message_list_key, t);
      return {
        ...state,
        messageList: action.payload,
      };
    case 'UPDATE_SINGLE_MESSAGE':
      const updatedMessageList = state.messageList.map(message =>
        message.id === action.payload.id ? { ...message, desc: action.payload.desc } : message
      );
      console.log("updatedMessageList",updatedMessageList);
      localStorage.setItem(configData.message_list_key, JSON.stringify(updatedMessageList));
      return {
        ...state,
        messageList: updatedMessageList,
      };
    default:
      return state;
  }
};

const store = configureStore({
  reducer: {
    messages: reducer,
    answer: answerReducer,
  },
});

export default store;
