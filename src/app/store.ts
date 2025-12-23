import {configureStore} from "@reduxjs/toolkit";
import counterReducer from '../features/counter/CounterSlice.ts'
import AuthSlice from "../features/auth/AuthSlice.ts";

export const store = configureStore ({
    reducer:{
        counter: counterReducer,
        auth: AuthSlice,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;