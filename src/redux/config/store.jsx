import { configureStore } from '@reduxjs/toolkit';
import messagelistReducer from '../slice/messageListSlice'
import contentReducer from '../slice/contentSlice'
import {answerApi,genAISlice} from '../slice/answerSlice'
import configReducer from '../slice/configSlice'
import chatReducer from '../slice/chatSlice'

const store = configureStore({
  reducer: {
    [answerApi.reducerPath]: answerApi.reducer, // add api reducer
    genAI: genAISlice.reducer,
    config: configReducer,
    messages: messagelistReducer,
    answer: contentReducer,
    chat: chatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(answerApi.middleware), // add api middleware
});

export default store;