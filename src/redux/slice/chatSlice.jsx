// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// // import { supabase } from './supabaseClient';

// // Define async thunk to fetch chat messages
// // export const fetchChatMsgs = createAsyncThunk(
// //   'chatMsgs/fetchChatMsgs',
// //   async () => {
// //     const { data: chatMsgs, error } = await supabase
// //       .from('chatMsgs') // Assuming you have a "chatMsgs" table in Supabase
// //       .select('*');
// //     if (error) throw error;
// //     return chatMsgs;
// //   }
// // );

// const chatMsgsSlice = createSlice({
//   name: 'chatMsgs',
//   initialState: {
//     chatMsgs: [], 
//     status: 'idle',
//     error: null,
//   },
//   reducers: {
//     // Add other reducer functions for chatMsgs, like addChatMsg, deleteChatMsg, updateChatMsg 
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchChatMsgs.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchChatMsgs.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.chatMsgs = action.payload; // Update chatMsgs state
//       })
//       .addCase(fetchChatMsgs.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.error.message;
//       });
//   },
// });

// // Rename actions to reflect chatMsgs
// export const { addChatMsg, deleteChatMsg, updateChatMsg } = chatMsgsSlice.actions; 

// const { actions, reducer } = chatMsgsSlice

// export default reducer;