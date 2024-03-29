// answerSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  answer: null,
};

const answerSlice = createSlice({
  name: 'answer',
  initialState,
  reducers: {
    setAnswer: (state, action) => {
      state.answer = action.payload;
    },
  },
});

export const { setAnswer } = answerSlice.actions;

export default answerSlice.reducer;
