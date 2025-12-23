
import { Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
    return (
        <>
            <h5 className="text-center mb-4">Đăng ký tài khoản</h5>
            <Form>
                <Form.Group className="mb-3" controlId="formBasicUsername">
                    <Form.Label>Tên người dùng</Form.Label>
                    <Form.Control type="text" placeholder="Nhập Tên của bạn" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label>Mật khẩu</Form.Label>
                    <Form.Control type="password" placeholder="Mật khẩu" />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                    <Form.Label>Xác nhận mật khẩu</Form.Label>
                    <Form.Control type="password" placeholder="Nhập lại mật khẩu" />
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
