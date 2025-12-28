import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import webSocketService from "../services/WebSocketService.ts";
import { handleServerResponse } from "../utils/HandleDataResponse.ts";
import { loginFailure, loginSuccess } from "./auth/AuthSlice.ts";
import { useAppDispatch } from "../app/hooks.ts";

// Component này sẽ luôn được mount, là nơi lý tưởng để quản lý các tác vụ nền
// như WebSocket.
export default function RootLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        // Kết nối một lần duy nhất khi ứng dụng khởi động
        webSocketService.connect();

        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'RECEIVE_MESSAGE') {
                try {
                    const data = JSON.parse(event.payload);
                    // Chỉ lắng nghe các sự kiện liên quan đến xác thực
                    if (['LOGIN', 'REGISTER', 'RE_LOGIN'].includes(data?.event)) {
                        const result = handleServerResponse(data);
                        if (result.type === 'SUCCESS') {
                            const username = localStorage.getItem('username');
                            if (username) {
                                dispatch(loginSuccess(username));
                                navigate('/chat', { replace: true });
                            }
                        } else {
                            dispatch(loginFailure(result.payload));
                        }
                    }
                } catch (e) { /* Bỏ qua các message không phải JSON */ }
            }
        });

        // Hàm dọn dẹp này sẽ chỉ chạy khi người dùng đóng tab trình duyệt
        return () => unsubscribe();
    }, [dispatch, navigate]); // Dependencies ổn định, chỉ chạy 1 lần

    return <Outlet />; // Hiển thị các route con (LoginPage, ChatLayout, etc.)
}