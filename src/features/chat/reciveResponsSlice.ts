import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface checkUserOnlineState {
    isWaiting: boolean,
    endTask: boolean,
    name: string
}

const initialState: checkUserOnlineState = {
    isWaiting: false,
    endTask: true,
    name: ''
}
export const CheckUserOnlineSlice = createSlice({
    name: "checkUserOnline",
    initialState: initialState,
    reducers: {
        setNameToCheckOnline: (state, action : PayloadAction<string>) => {
            state.name = action.payload
        },
        setWaiting: (state) => {
            state.isWaiting = true;
        },
        resetWaitingForUserOnline: (state) => {
            state.isWaiting = false;
        },
        setEndTask: (state) => {
            state.endTask = true;
        },
        resetReceivePrestates: (state) => {
            state.isWaiting = false;
            state.endTask = false;
            state.name = '';
        }
    }
})
export const {setNameToCheckOnline,setWaiting,resetWaitingForUserOnline, setEndTask, resetReceivePrestates} = CheckUserOnlineSlice.actions;
export default CheckUserOnlineSlice.reducer