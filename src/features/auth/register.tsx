import { Form, Button } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import {useEffect, useRef, useState} from "react";
import * as React from "react";
import authService from "../../services/authService.ts";
import webSocketService from "../../services/WebSocketService.ts";
import {handleServerResponse} from "../../utils/HandleDataResponse.ts";
import {loginSuccess} from "./AuthSlice.ts";


const RegisterPage = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] =useState('')
    const isLoading = useAppSelector((state) => state.auth.isLoading)
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const usernameRef = useRef(username)
    const [error , setError] = useState('');


    const dispatch = useAppDispatch()

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        if(!username || username.trim() === ''){
            setError('Username is not empty');
            return;
        }
        if(!password || password.trim() === '' ){
            setError('Password is not empty');
            return;
        }
        if(password !== confirmPassword){
            setError('Passwords don\'t match');
            return;
        }
        setError('')

       authService.register({user: username,pass: password})
    }

    useEffect(() =>{
        webSocketService.connect();
        const unSubscribe = webSocketService.subscribe((event) => {
           if(event.type === 'RECEIVE_MESSAGE'){
               // Dữ liệu event.payload giờ là một object đã được parse
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
    },[navigate, dispatch]);

    return (
        <>
            {!isLoading  }
            <h5 className="text-center mb-4">Đăng ký tài khoản</h5>
            {error && <p className="text-danger">{error}</p>}
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập Tên của bạn"
                        value={username}
                        onChange={(e) => setUsername( e.target.value)}
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

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </Form.Group>

                <div className="d-grid gap-2">
                    <Button variant="primary" type="submit">
                        Đăng ký
                    </Button>
                </div>

                <div className="text-center mt-3">
                    <small>
                        Đã có tài khoản? <Link to="/auth/login">Đăng nhập</Link>
                    </small>
                </div>
            </Form>
        </>
    );
};

export default RegisterPage;
