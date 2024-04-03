import { createSlice } from '@reduxjs/toolkit';

export const contentSlice = createSlice({
  name: 'content',
  initialState: {
    value: '',
    isLoading :false,
  },
  reducers: {
    setContent: (state, action) => {
      state.value = action.payload.value;
      state.isLoading = action.payload.isLoading;
    },
  },
});

export const { setContent } = contentSlice.actions;

// Extract the action creators object and the reducer
const { actions, reducer } = contentSlice

export default reducer;
