import {createSlice} from "@reduxjs/toolkit";

interface connection{
    isConnected: boolean,
}

const initialState: connection = {
    isConnected: false,
}
export const connectionSlice = createSlice({
    name: 'connection',
    initialState: initialState,
    reducers: {
        connect: (state) => {
            state.isConnected = true;
        },
        disconnect: (state) => {
            state.isConnected = false;
        },
    }
})
export const {connect, disconnect} = connectionSlice.actions;
export default connectionSlice.reducer;