import { Form, Button, Spinner } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../app/hooks.ts";
import * as React from "react";
import {useEffect, useRef, useState} from 'react';
import webSocketService from "../../services/WebSocketService.ts";
import authService from "../../services/authService.ts";
import { handleServerResponse } from "../../utils/HandleDataResponse.ts";
import { loginStart, loginSuccess } from "./AuthSlice.ts";

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const isLoading = useAppSelector((state) => state.auth.isLoading);
    const navigate = useNavigate();
    const usernameRef = useRef(username)
    const [error, setError ] = useState('')

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

    useEffect(() => {
        webSocketService.connect();

        const unSubscribe = webSocketService.subscribe((event) => {
            if(event.type === 'RECEIVE_MESSAGE'){
                console.log("data: ", event.payload);
                const ReLoginCode = handleServerResponse(event.payload);
                if(ReLoginCode){
                    dispatch(loginSuccess(usernameRef.current));
                    navigate('/chat', { replace: true });
                }
            }
        })
        return () => {
            unSubscribe();
        }
    }, [navigate, dispatch])

    return (
        <>
            {error && <p className="text-danger">{error}</p>}
            <h5 className="text-center mb-4">Đăng nhập</h5>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập Tên của bạn"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                                {' '}Đang xử lý...
                            </>
                        ) : 'Đăng nhập'}
                    </Button>
                </div>
                
                <div className="text-center mt-3">
                    <small>
                        Chưa có tài khoản? <Link to="/auth/register">Đăng ký ngay</Link>
                    </small>
                </div>
            </Form>
        </>
    );
};

export default LoginPage;
