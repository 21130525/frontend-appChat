import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface NotificationState {
    actionNotify : string,
    statusNotify: boolean,
    announce: string
}
const initialState: NotificationState ={
    actionNotify: '',
    statusNotify: false,
    announce: ''
}
const NotificationSlice = createSlice({
    name: 'notification',
    initialState: initialState,
    reducers: {
        setActionNotify: (state, action) => {
            state.actionNotify = action.payload;
        },
        setStatusNotify: (state, action:PayloadAction<boolean>) => {
            state.statusNotify = action.payload;
        },
        setAnnounce: (state, action) => {
            state.announce = action.payload;
        },
        resetNotification: (state) => {
            state.actionNotify = '';
            state.statusNotify = false;
            state.announce = '';
        }
    }
})
export const {setActionNotify, setStatusNotify, setAnnounce, resetNotification} = NotificationSlice.actions;
export default NotificationSlice.reducer;
