import { Outlet } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';

const AuthLayout = () => {
    return (
        <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
            <Container style={{ maxWidth: '400px' }}>
                <Card className="shadow-sm border-0">
                    <Card.Body className="p-4">
                        <div className="text-center mb-4">
                            <h4 className="fw-bold">App Chat</h4>
                        </div>
                        <Outlet />
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default AuthLayout;
