import {configureStore} from "@reduxjs/toolkit";
import counterReducer from '../features/counter/CounterSlice.ts'
import AuthSlice from "../features/auth/AuthSlice.ts";
import RegisterSlice from "../features/auth/register/RegisterSlice.ts";

export const store = configureStore ({
    reducer:{
        counter: counterReducer,
        auth: AuthSlice,
        register: RegisterSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;