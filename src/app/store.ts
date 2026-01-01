import {configureStore} from "@reduxjs/toolkit";
import AuthSlice from "../features/auth/AuthSlice.ts";
import connectionReducer from "../features/socket/AccessSlice.ts";
import userReducer from "../features/chat/chatSidebar/UserSlice.ts"; // Import default export (reducer)
import chatReducer from "../features/chat/chatWindow/ChatSlice.ts"
export const store = configureStore ({
    reducer:{
        auth: AuthSlice,
        connection: connectionReducer,
        listUser: userReducer,
        chat: chatReducer
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
