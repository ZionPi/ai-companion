import { configureStore } from '@reduxjs/toolkit';
import messagelistReducer from '../slice/messageListSlice'
import contentReducer from '../slice/contentSlice'
import api from '../slice/answerSlice'
import configReducer from '../slice/configSlice'
import chatReducer from '../slice/chatSlice'

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // add api reducer
    config: configReducer,
    messages: messagelistReducer,
    answer: contentReducer,
    chat: chatReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // add api middleware
});

export default store;