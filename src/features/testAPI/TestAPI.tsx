import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge } from 'react-bootstrap';
import webSocketService from '../../services/WebSocketService.ts';
import { useAppSelector} from "../../app/hooks.ts";

// Định nghĩa cấu trúc cho các Service mẫu
interface ServiceOption {
    key: string;
    label: string;
    template: object; // Mẫu JSON body
    description?: string;
}

// Danh sách các service đã hiện thực (Mock data dựa trên context)
const AVAILABLE_SERVICES: ServiceOption[] = [
    {
        key: 'CUSTOM',
        label: 'Tùy chỉnh (Custom)',
        template: { event: '', data: {} },
        description: 'Nhập JSON tùy ý'
    },
    {
        key: 'LOGIN',
        label: 'Đăng nhập (LOGIN)',
        template: { action: 'onchat', data: { event: 'LOGIN', data: { user: 'username', pass: 'password' } } },
        description: 'Gửi user/pass để lấy RE_LOGIN_CODE'
    },
    {
        key: 'REGISTER',
        label: 'Đăng ký (REGISTER)',
        template: { action: 'onchat', data: { event: 'REGISTER', data: { user: 'username', pass: 'password' } } },
        description: 'Tạo tài khoản mới'
    },
    {
        key: 'RE_LOGIN',
        label: 'Đăng nhập lại (RE_LOGIN)',
        template: { action: 'onchat', data: { event: 'RE_LOGIN', data: { RE_LOGIN_CODE: 'code_here' } } },
        description: 'Dùng code để đăng nhập lại'
    },
    {
        key: 'GET_USER_LIST',
        label: 'Lấy danh sách User (UserService)',
        template: { action: 'onchat', data: { event: 'GET_USER_LIST' } },
        description: 'Lấy danh sách tất cả người dùng'
    },
    {
        key: 'CHECK_USER_ONLINE',
        label: 'Check User Online (UserService)',
        template: { action: 'onchat', data: { event: 'CHECK_USER_ONLINE', data: { user: 'username' } } },
        description: 'Kiểm tra trạng thái online của user'
    },
    {
        key: 'CHECK_USER_EXIST',
        label: 'Check User Exist (UserService)',
        template: { action: 'onchat', data: { event: 'CHECK_USER_EXIST', data: { user: 'username' } } },
        description: 'Kiểm tra user có tồn tại không'
    },
    {
        key: 'SEND_CHAT',
        label: 'Gửi tin nhắn (ChatService)',
        template: { action: 'onchat', data: { event: 'SEND_CHAT', data: { type: 'people', to: 'username', mes: 'Hello world' } } },
        description: 'Gửi tin nhắn tới user khác'
    },
    {
        key: 'GET_PEOPLE_CHAT_MES',
        label: 'Lấy lịch sử chat (ChatService)',
        template: { action: 'onchat', data: { event: 'GET_PEOPLE_CHAT_MES', data: { user: 'username' } } },
        description: 'Lấy lịch sử tin nhắn với user'
    },
    {
        key: 'PING',
        label: 'Kiểm tra kết nối (PING)',
        template: { event: 'PING' },
        description: 'Gửi heartbeat để giữ kết nối'
    }
];

const TestAPI = () => {
    const [selectedServiceKey, setSelectedServiceKey] = useState<string>(AVAILABLE_SERVICES[0].key);
    const [payloadInput, setPayloadInput] = useState<string>(JSON.stringify(AVAILABLE_SERVICES[0].template, null, 2));
    const [logs, setLogs] = useState<{ type: 'SENT' | 'RECEIVED', content: any, timestamp: string }[]>([]);
    const isConnected = useAppSelector((state) => state.connection.isConnected)

    useEffect(() => {
        webSocketService.connect();

        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'RECEIVE_MESSAGE') {
                try {
                    // Cố gắng parse JSON để hiển thị đẹp hơn, nếu không thì để nguyên text
                    const content = typeof event.payload === 'string' ? JSON.parse(event.payload) : event.payload;
                    addLog('RECEIVED', content);
                } catch (e) {
                    addLog('RECEIVED', event.payload);
                }
            }
        });

        return () => {
            unsubscribe();
            // Không disconnect ở đây nếu muốn giữ kết nối cho toàn app, 
            // nhưng nếu trang này độc lập thì có thể giữ nguyên logic cũ.
            // webSocketService.disconnect(); 
        };
    }, []);

    const addLog = (type: 'SENT' | 'RECEIVED', content: any) => {
        setLogs(prev => [{
            type,
            content,
            timestamp: new Date().toLocaleTimeString()
        }, ...prev]);
    };

    const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const key = e.target.value;
        setSelectedServiceKey(key);
        const service = AVAILABLE_SERVICES.find(s => s.key === key);
        if (service) {
            setPayloadInput(JSON.stringify(service.template, null, 2));
        }
    };

    const handleSendMessage = () => {
        if (payloadInput.trim()) {
            try {
                // Validate JSON trước khi gửi
                const jsonPayload = JSON.parse(payloadInput);
                webSocketService.sendMessage(JSON.stringify(jsonPayload));
                addLog('SENT', jsonPayload);
            } catch (e) {
                alert("JSON không hợp lệ! Vui lòng kiểm tra lại cú pháp.");
            }
        }
    };

    return (
        <Container fluid className="p-3 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>WebSocket API Tester</h3>
                <Badge bg={isConnected === true ? 'success' : 'danger'}>
                    {isConnected === true ? 'Đã kết nối' : 'Chưa kết nối'}
                </Badge>
            </div>
            
            <Row className="h-100">
                {/* Cột trái: Cấu hình & Input */}
                <Col md={5} lg={4}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="bg-primary text-white">Cấu hình Request</Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Chọn Service:</Form.Label>
                                <Form.Select value={selectedServiceKey} onChange={handleServiceChange}>
                                    {AVAILABLE_SERVICES.map(s => (
                                        <option key={s.key} value={s.key}>{s.label}</option>
                                    ))}
                                </Form.Select>
                                <Form.Text className="text-muted">
                                    {AVAILABLE_SERVICES.find(s => s.key === selectedServiceKey)?.description}
                                </Form.Text>
                            </Form.Group>

                            <Form.Group className="mb-3 flex-grow-1">
                                <Form.Label className="fw-bold">Payload (JSON):</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={12}
                                    value={payloadInput}
                                    onChange={(e) => setPayloadInput(e.target.value)}
                                    style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
                                />
                            </Form.Group>

                            <div className="d-grid">
                                <Button 
                                    variant="primary" 
                                    onClick={handleSendMessage} 
                                    disabled={!isConnected}
                                >
                                    Gửi Request (Send)
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cột phải: Kết quả (Logs) */}
                <Col md={7} lg={8}>
                    <Card className="h-100 shadow-sm">
                        <Card.Header className="d-flex justify-content-between align-items-center bg-light">
                            <span>Kết quả / Logs</span>
                            <Button variant="outline-secondary" size="sm" onClick={() => setLogs([])}>
                                Xóa Logs
                            </Button>
                        </Card.Header>
                        <Card.Body className="bg-light p-2" style={{ overflowY: 'auto', maxHeight: '80vh' }}>
                            {logs.length === 0 ? (
                                <div className="text-center text-muted mt-5">Chưa có dữ liệu...</div>
                            ) : (
                                logs.map((log, index) => (
                                    <div key={index} className="mb-3">
                                        <div className="d-flex justify-content-between align-items-center mb-1">
                                            <Badge bg={log.type === 'SENT' ? 'primary' : 'success'}>
                                                {log.type === 'SENT' ? 'GỬI ĐI (REQUEST)' : 'NHẬN VỀ (RESPONSE)'}
                                            </Badge>
                                            <small className="text-muted">{log.timestamp}</small>
                                        </div>
                                        <Card className="border-0 shadow-sm">
                                            <Card.Body className="p-2">
                                                <pre className="m-0" style={{ fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                                                    {typeof log.content === 'object' 
                                                        ? JSON.stringify(log.content, null, 2) 
                                                        : log.content}
                                                </pre>
                                            </Card.Body>
                                        </Card>
                                    </div>
                                ))
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TestAPI;
