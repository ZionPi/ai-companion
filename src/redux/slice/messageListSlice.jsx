import { createSlice } from '@reduxjs/toolkit';
import configData from '../../data/config.json';

const config = JSON.parse(localStorage.getItem(configData.config_key)) || configData;


const initialState = {
    messageList: JSON.parse(localStorage.getItem(config.message_list_key)) || [],
};

const messageListSlice = createSlice({
    name: 'messagelist',
    initialState,
    reducers: {
        updateMessageList: (state, action) => {
            state.messageList = action.payload;
            // console.log('updateMessageList',action.payload);
            localStorage.setItem(config.message_list_key, JSON.stringify(state.messageList));
        },

        updateSingleItem: (state, action) => {
            state.messageList = state.messageList.map(message =>
                message.id === action.payload.id ? { ...message, desc: action.payload.desc,isLoading : action.payload.isLoading } : message
            );
            localStorage.setItem(config.message_list_key, JSON.stringify(state.messageList));
            // console.log('updateSingleItem',state.messageList);
        }
    },
})

// Extract the action creators object and the reducer
const { actions, reducer } = messageListSlice

export const { updateMessageList, updateSingleItem } = actions

export default reducer