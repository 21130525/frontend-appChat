import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import webSocketService from "../services/WebSocketService.ts";
import { handleServerResponse } from "../utils/HandleDataResponse.ts";
import { loginFailure, loginSuccess } from "./auth/AuthSlice.ts";
import { useAppDispatch } from "../app/hooks.ts";
import authService from "../services/authService.ts";

// Component này sẽ luôn được mount, là nơi lý tưởng để quản lý các tác vụ nền
// như WebSocket.
export default function RootLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        webSocketService.connect();

        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'STATUS_CHANGE' && event.payload === 'CONNECTED') {
                const savedUsername = localStorage.getItem('username');
                const savedReLoginCode = localStorage.getItem('reLoginCode');
                if (savedUsername && savedReLoginCode) {
                    authService.reLogin(savedUsername,savedReLoginCode)
                }
            }
            if (event.type === 'RECEIVE_MESSAGE') {
                try {
                    const data = JSON.parse(event.payload);
                    if (['RE_LOGIN'].includes(data?.event)) {
                        const result = handleServerResponse(data);
                        if (result) {
                            const username = localStorage.getItem('username');
                            if (username) {
                                dispatch(loginSuccess(username));
                                navigate('/chat', { replace: true });
                            }
                        } else {
                            dispatch(loginFailure());
                        }
                    }
                } catch (e) {
                    console.error(e)
                }
            }
        });

        // Hàm dọn dẹp này sẽ chỉ chạy khi người dùng đóng tab trình duyệt
        return () => unsubscribe();
    }, [dispatch, navigate]); // Dependencies ổn định, chỉ chạy 1 lần

    return <Outlet />; // Hiển thị các route con (LoginPage, ChatLayout, etc.)
}