import {createSlice} from "@reduxjs/toolkit";

interface WaitingState {
    isWaiting: boolean
    action: string,
    data: string
}

const initialState: WaitingState = {
    isWaiting: false,
    action: '',
    data: ''
}
const WaitingSlice = createSlice({
    name: 'waiting',
    initialState: initialState,
    reducers: {
        setWaiting: (state) => {
            state.isWaiting = true;
        },
        setAction: (state, action) => {
            state.action = action.payload;
        },
        setData: (state, action) => {
            state.data = action.payload;
        },
        resetWaiting: (state) => {
            state.isWaiting = false;
        },
        resetStateWaiting: (state) => {
            state.isWaiting = false;
            state.action = '';
            state.data = '';

        }
    }
})
export const {setWaiting, resetWaiting, setAction, setData,resetStateWaiting} = WaitingSlice.actions;
export default WaitingSlice.reducer;