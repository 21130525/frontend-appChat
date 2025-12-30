import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Spinner } from "react-bootstrap";
import webSocketService from "../services/WebSocketService.ts";
import { handleServerResponse } from "../utils/HandleDataResponse.ts";
import { loginFailure, loginSuccess } from "./auth/AuthSlice.ts";
import { connect, disconnect } from "./socket/AccessSlice.ts";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import authService from "../services/authService.ts";

// Component này sẽ luôn được mount, là nơi lý tưởng để quản lý các tác vụ nền
// như WebSocket.
export default function RootLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isConnected = useAppSelector((state) => state.connection.isConnected);

    useEffect(() => {
        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'STATUS_CHANGE') {
                if (event.payload === 'CONNECTED') {
                    dispatch(connect());
                    console.log('reLogin ');
                    const savedUsername = localStorage.getItem('username');
                    const savedReLoginCode = localStorage.getItem('reLoginCode');
                    if (savedUsername && savedReLoginCode) {
                        authService.reLogin(savedUsername, savedReLoginCode);
                    }
                } else if (event.payload === 'DISCONNECTED' || event.payload === 'ERROR') {
                    dispatch(disconnect());
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

        // Gọi connect sau khi đã subscribe để đảm bảo bắt được sự kiện CONNECTED nếu socket đã mở sẵn
        webSocketService.connect();

        // Hàm dọn dẹp này sẽ chỉ chạy khi người dùng đóng tab trình duyệt
        return () => unsubscribe();
    }, [dispatch, navigate]); // Dependencies ổn định, chỉ chạy 1 lần

    if (!isConnected) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
                <div className="mt-3">Đang kết nối với server...</div>
            </div>
        );
    }

    return <Outlet />; // Hiển thị các route con (LoginPage, ChatLayout, etc.)
}