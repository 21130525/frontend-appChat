import {configureStore} from "@reduxjs/toolkit";
import counterReducer from '../features/counter/CounterSlice.ts'
import AuthSlice from "../features/auth/AuthSlice.ts";
import connectionReducer from "../features/socket/AccessSlice.ts";
import userReducer from "../features/chat/UserSlice.ts"; // Import default export (reducer)

export const store = configureStore ({
    reducer:{
        counter: counterReducer,
        auth: AuthSlice,
        connection: connectionReducer,
        listUser: userReducer,
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
