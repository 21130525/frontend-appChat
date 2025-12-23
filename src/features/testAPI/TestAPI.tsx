import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import webSocketService from '../../services/WebSocketService.ts';

const TestAPI = () => {
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<any[]>([]);
    const [connectionStatus, setConnectionStatus] = useState('DISCONNECTED');

    useEffect(() => {
        // Kết nối khi component được mount
        webSocketService.connect();

        // Lắng nghe các sự kiện từ WebSocket
        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'STATUS_CHANGE') {
                setConnectionStatus(event.payload);
            } else if (event.type === 'RECEIVE_MESSAGE') {
                // Xử lý tin nhắn nhận được
                const mes = JSON.parse(event.payload);
                const message = JSON.stringify(mes)
                setReceivedMessages(prevMessages => [...prevMessages,message]);
            }
        });

        // Dọn dẹp khi component bị unmount
        return () => {
            unsubscribe();
            webSocketService.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (message.trim()) {
            webSocketService.sendMessage(message);
            setMessage('');
        }
    };

    return (
        <Container fluid className="p-3">
            <h3 className="mb-4">WebSocket API Tester</h3>
            <Row>
                {/* Cột trái: Input */}
                <Col md={6}>
                    <Card>
                        <Card.Header>Input</Card.Header>
                        <Card.Body>
                            <Form.Group>
                                <Form.Label>Message (JSON or Text)</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={10}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />
                            </Form.Group>
                            <Button className="mt-3" onClick={handleSendMessage} disabled={connectionStatus !== 'CONNECTED'}>
                                Send Message
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cột phải: Output */}
                <Col md={6}>
                    <Card>
                        <Card.Header>Output</Card.Header>
                        <Card.Body style={{ height: '300px', overflowY: 'auto' }}>
                            {receivedMessages.length === 0 ? (
                                <p className="text-muted">Waiting for messages...</p>
                            ) : (
                                receivedMessages.map((msg, index) => (
                                    <pre key={index} className="bg-light p-2 rounded mb-2">
                                        {JSON.stringify(msg, null, 2)}
                                    </pre>
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
