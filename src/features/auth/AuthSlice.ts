import {createSlice} from "@reduxjs/toolkit";

const authState = {
    User: null,
    token: null,
    isAuthenticated: false,
    isLoading: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState: authState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true;
        },
        loginSuccess: (state, action) => {
            state.isLoading = false;
            state.isAuthenticated = true;
            state.User = action.payload;
        },
        loginFailure: (state) => {
            state.isLoading = false;
            state.isAuthenticated = false;
            state.User = null;
        },

        logout: (state) => {
            state.isAuthenticated = false;
            state.User = null;
        }

    }
});

export const { loginStart } = authSlice.actions;
export default authSlice.reducer;