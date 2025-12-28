import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
interface AuthState {
    user: string | null,
    token: string | null,
    isAuthenticated: boolean,
    isLoading: boolean
}

const initialState: AuthState = {
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action : PayloadAction<string>) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
        },
        loginFailure: (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.user = null;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.user = null;
            // Xóa thông tin đăng nhập khỏi localStorage khi logout
            localStorage.removeItem('reLoginCode');
            localStorage.removeItem('username');
        }

    }
});

export const { loginStart,loginSuccess,loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;