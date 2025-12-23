import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    return (
        <>
            <h5 className="text-center mb-4">Đăng nhập</h5>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control type="text" placeholder="Nhập Tên của bạn" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control type="password" placeholder="Mật khẩu" />
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
