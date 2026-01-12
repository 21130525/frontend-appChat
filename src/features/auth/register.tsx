import { Form, Button, Spinner } from 'react-bootstrap';
import {Link, useNavigate} from 'react-router-dom';
import {useAppSelector} from "../../app/hooks.ts";
import {useEffect, useRef, useState} from "react";
import * as React from "react";
import authService from "../../services/authService.ts";
import webSocketService from "../../services/WebSocketService.ts";
import {handleEvent, handleServerResponse} from "../../utils/HandleDataResponse.ts";
import './auth.css';

const RegisterPage = () => {
    const [username,setUsername] = useState('')
    const [password,setPassword] =useState('')
    const isLoading = useAppSelector((state) => state.auth.isLoading)
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    const usernameRef = useRef(username)
    const [error , setError] = useState('');

    const handleSubmit = (e : React.FormEvent) => {
        e.preventDefault();

        if(!username || username.trim() === ''){
            setError('Tên người dùng không được để trống');
            return;
        }
        if(!password || password.trim() === '' ){
            setError('Mật khẩu không được để trống');
            return;
        }
        if(password !== confirmPassword){
            setError('Mật khẩu không khớp');
            return;
        }
        setError('')

       authService.register({user: username,pass: password})
    }
    useEffect(() => {
        usernameRef.current = username;
    }, [username]);

    useEffect(() =>{
        const unSubscribe = webSocketService.subscribe((event) => {
           if(event.type === 'RECEIVE_MESSAGE'){
               const data = JSON.parse(event.payload);
               const response = handleServerResponse(data)
               if(response?.event === 'REGISTER'){
                   const type = handleEvent(response);
                   if(type){
                       sessionStorage.setItem('username', usernameRef.current);
                       sessionStorage.setItem('announce', "register success");
                       navigate('/auth/login', { replace: true });
                   }else{
                       setError('Đăng ký thất bại');
                       setUsername('');
                       setPassword('');
                   }
               }
           }
        })
        return () => {
            unSubscribe();
        }
    },[navigate]);

    return (
        <>
            <h2 className="auth-subtitle">Đăng ký</h2>
            
            {error && <div className="auth-message error">{error}</div>}
            
            <Form className="auth-form" onSubmit={handleSubmit}>
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

                <Form.Group className="mb-3 form-group-auth" controlId="formBasicConfirmPassword">
                    <Form.Label className="form-label-auth">Xác nhận mật khẩu</Form.Label>
                    <Form.Control
                        className="form-control-auth"
                        type="password"
                        placeholder="Nhập lại mật khẩu"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
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
                        ) : 'Đăng ký'}
                    </Button>
                </div>

                <div className="auth-link-container">
                    Đã có tài khoản? <Link to="/auth/login" className="auth-link">Đăng nhập</Link>
                </div>
            </Form>
        </>
    );
};

export default RegisterPage;
