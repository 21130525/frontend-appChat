import { Form, Button, Spinner } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import * as React from "react";
import {useEffect, useRef, useState} from 'react';
import webSocketService from "../../services/WebSocketService.ts";
import authService from "../../services/authService.ts";
import {handleEvent, handleServerResponse} from "../../utils/HandleDataResponse.ts";
import {loginFailure, loginStart, loginSuccess} from "./AuthSlice.ts";
import './auth.css';

const LoginPage = () => {
    const [username, setUsername] = useState(() => {
        return localStorage.getItem("username") || '';
    });
    const [password, setPassword] = useState('');
    const isLoading = useAppSelector((state) => state.auth.isLoading);
    const navigate = useNavigate();
    const usernameRef = useRef(username)
    const [error, setError ] = useState('')
    const [announce, setAnnounce ] = useState('')


    const dispatch = useAppDispatch()

    const handleLogin = (e : React.FormEvent) => {
        e.preventDefault();

        if(!username || username.trim() === ''){
            setError('Tên người dùng không được để trống');
            return;
        }
        if(!password || password.trim() === '' ){
            setError('Mật khẩu không được để trống');
            return;
        }
        // Xóa lỗi cũ và bắt đầu trạng thái loading
        setError('');
        dispatch(loginStart());

        authService.login({ user: username, pass: password })
    }

    useEffect(()=>{
        usernameRef.current = username;
    },[username])

    // Xử lý thông báo từ trang đăng ký
    useEffect(() => {
        const announcement = sessionStorage.getItem('announce');
        if (announcement === 'register success') {
            setAnnounce("Đăng ký tài khoản thành công, vui lòng thực hiện đăng nhập");
            sessionStorage.removeItem('announce');
        }
    }, []); // Mảng rỗng đảm bảo effect này chỉ chạy một lần sau khi component mount

    useEffect(() => {
        webSocketService.connect();
        const unSubscribe = webSocketService.subscribe((event) => {
            if(event.type === 'RECEIVE_MESSAGE'){
                const data = JSON.parse(event.payload);
                const response = handleServerResponse(data);
                if(response?.event === 'LOGIN'){
                    const ReLoginCode = handleEvent(response);
                    if(ReLoginCode){
                        dispatch(loginSuccess(usernameRef.current));
                        // Lưu lại username để dùng cho lần re-login sau
                        localStorage.setItem('username', usernameRef.current);
                        navigate('/chat', { replace: true });
                    }else{
                        dispatch(loginFailure());
                        setError('Đăng nhập thất bại');
                        setUsername('');
                        setPassword('');
                    }
                }
            }
        })
        return () => {
            unSubscribe();
        }
    }, [navigate, dispatch])

    return (
        <>
            <h2 className="auth-subtitle">Đăng nhập</h2>
            
            {error && <div className="auth-message error">{error}</div>}
            {announce && <div className="auth-message success">{announce}</div>}
            
            <Form className="auth-form" onSubmit={handleLogin}>
                <Form.Group className="mb-3 form-group-auth" controlId="formBasicUsername">
                    <Form.Label className="form-label-auth">Tên người dùng</Form.Label>
                    <Form.Control
                        className="form-control-auth"
                        type="text"
                        placeholder="Nhập Tên của bạn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3 form-group-auth" controlId="formBasicPassword" style={{ position: 'relative' }}>
                    <Form.Label className="form-label-auth">Mật khẩu</Form.Label>
                    <Form.Control
                        className="form-control-auth"
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span className="lock-icon">🔒</span>
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button 
                        className="auth-button" 
                        variant="primary" 
                        type="submit" 
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                {' '}Đang xử lý...
                            </>
                        ) : 'Đăng nhập'}
                    </Button>
                </div>
                
                <div className="auth-link-container">
                    Chưa có tài khoản? <Link to="/auth/register" className="auth-link">Đăng ký ngay</Link>
                </div>
            </Form>
        </>
    );
};

export default LoginPage;
