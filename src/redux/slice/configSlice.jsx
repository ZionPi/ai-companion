import configData from '../../data/config.json';
import { createSlice } from '@reduxjs/toolkit';


const initialState = {
    config: JSON.parse(localStorage.getItem(configData.config_key)) || configData,
};

const configSlice = createSlice({
    name: 'config',
    initialState,
    reducers: {
        loadConfig: (state, action) => {
            state.config = JSON.parse(localStorage.getItem(configData.config_key)) || configData;
        },

        saveConfig: (state, action) => {
            var data = action.payload;
            state.config = data;
            localStorage.setItem(configData.config_key, JSON.stringify(data));
        }
    },
})


// Extract the action creators object and the reducer
const { actions, reducer } = configSlice

export const { loadConfig, saveConfig } = actions

export default reducer