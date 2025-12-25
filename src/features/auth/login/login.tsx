import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {setPassword, setUsername} from "../register/RegisterSlice.ts";
import * as React from "react";
import {useEffect, useState} from "react";
import webSocketService from "../../../services/WebSocketService.ts";
import authService from "../../../services/authService.ts";

const LoginPage = () => {
    const username = useAppSelector((state) => state.login.username)
    const password = useAppSelector((state) => state.login.password)
    const isLoading = useAppSelector((state) => state.login.isLoading)

    const [error, setError ] = useState('')

    const dispatch = useAppDispatch()
    const handleLogin = (e : React.FormEvent) => {
        e.preventDefault();

        if(!username || username.trim() === ''){
            setError('Username is not empty');
            return;
        }
        if(!password || password.trim() === '' ){
            setError('Password is not empty');
            return;
        }
        authService.login({user: username,pass: password})
    }

    useEffect(() =>{
        webSocketService.connect();
        const unSubscribe = webSocketService.subscribe((event) => {
            if(event.type === 'RECEIVE_MESSAGE'){
                // const data = JSON.parse(event.payload);
                console.log("data: "+event.payload);
            }
        })
        return () => {
            unSubscribe();
        }
    },[])

    return (
        <>
            {!isLoading}
            {error && <p className="text-danger">{error}</p>}
            <h5 className="text-center mb-4">Đăng nhập</h5>
            <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập Tên của bạn"
                        value={username}
                        onChange={(e) => dispatch(setUsername( e.target.value))}
                    />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Mật khẩu"
                        value={password}
                        onChange={(e) => dispatch(setPassword(e.target.value))}
                    />
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                        Đăng nhập
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
