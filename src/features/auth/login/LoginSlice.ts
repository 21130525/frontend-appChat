import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

interface LoginState {
    username: string,
    password: string,
    isLoading: boolean
}
const initialState : LoginState = {
    username: '',
    password: '',
    isLoading: false
}
export const LoginSlice =  createSlice({
    name: 'login',
    initialState,
    reducers: {
        setUsername: (state, action : PayloadAction<string>) => {
            state.username = action.payload;
        },
        setPassword: (state, action : PayloadAction<string>) => {
            state.password = action.payload;
        },
        setLoading: (state, action : PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        }
    }
})
export const {setUsername, setPassword, setLoading} = LoginSlice.actions;
export default LoginSlice.reducer;