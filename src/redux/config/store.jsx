import { configureStore } from '@reduxjs/toolkit';
import messagelistReducer from '../slice/messageListSlice'
import contentReducer from '../slice/contentSlice'
import api from '../slice/answerSlice'
import configReducer from '../slice/configSlice'

const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer, // add api reducer
    config: configReducer,
    messages: messagelistReducer,
    answer: contentReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware), // add api middleware
});

export default store;