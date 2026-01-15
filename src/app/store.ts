import {configureStore} from "@reduxjs/toolkit";
import AuthSlice from "../features/auth/AuthSlice.ts";
import connectionReducer from "../features/socket/AccessSlice.ts";
import userReducer from "../features/chat/chatSidebar/UserSlice.ts";
import chatReducer from "../features/chat/chatWindow/ChatRoomSlice.ts"
import searchReducer from "../features/chat/chatSidebar/SearchSlice.ts"
import receiveResponseReducer from "../features/chat/reciveResponsSlice.ts"
import WaitingSlice from "../features/SliceUtils/WaitingSlice.ts";
import NotificationSlice from "../features/SliceUtils/NotificationSlice.ts";
import ReceiveNewMessage from "../features/SliceUtils/RecivesNewMesSlice.ts";


export const store = configureStore ({
    reducer:{
        auth: AuthSlice,
        connection: connectionReducer,
        listUser: userReducer,
        chatRoom: chatReducer,
        search: searchReducer,
        checkUserOnline: receiveResponseReducer,
        waiting: WaitingSlice,
        notification: NotificationSlice,
        receiveNewMessage: ReceiveNewMessage
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
