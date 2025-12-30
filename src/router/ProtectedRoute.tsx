import {Navigate, Outlet} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks";
import {useEffect} from "react";
import {connect} from "react-redux";
import authService from "../services/authService.ts";
import {disconnect} from "../features/socket/AccessSlice.ts";
import webSocketService from "../services/WebSocketService.ts";

const ProtectedRoute = () => {
    const { isAuthenticated } = useAppSelector((state) => state.auth);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'STATUS_CHANGE') {
                if (event.payload === 'CONNECTED') {
                    dispatch(connect());
                    const savedUsername = localStorage.getItem('username');
                    const savedReLoginCode = localStorage.getItem('reLoginCode');
                    if (savedUsername && savedReLoginCode) {
                        console.log('reLogin ');
                        authService.reLogin(savedUsername, savedReLoginCode);
                    }
                } else if (event.payload === 'DISCONNECTED' || event.payload === 'ERROR') {
                    dispatch(disconnect());
                }
            }
        });
        return () => unsubscribe();
    }, [dispatch]);
    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;