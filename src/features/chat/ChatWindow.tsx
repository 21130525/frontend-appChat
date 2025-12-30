import { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';

interface ChatWindowProps {
    conversationId: string | null;
}

const ChatWindow = ({ conversationId }: ChatWindowProps) => {
    const [message, setMessage] = useState('');
    // Mock tin nhắn
    const [messages, setMessages] = useState([
        { id: 1, sender: 'other', text: 'Xin chào!', time: '10:00 AM' },
        { id: 2, sender: 'me', text: 'Chào bạn, có việc gì không?', time: '10:05 AM' },
        { id: 3, sender: 'other', text: 'Mình muốn hỏi về dự án App Chat.', time: '10:06 AM' },
    ]);

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;
        
        setMessages([...messages, {
            id: Date.now(),
            sender: 'me',
            text: message,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setMessage('');
    };

    if (!conversationId) {
        return (
            <div className="d-flex h-100 align-items-center justify-content-center bg-light">
                <div className="text-center text-muted">
                    <h4>Chào mừng đến với App Chat</h4>
                    <p>Chọn một cuộc hội thoại để bắt đầu nhắn tin</p>
                </div>
            </div>
        );
    }

    return (
        <div className="d-flex flex-column h-100 bg-light">
            {/* Header */}
            <div className="p-3 bg-white border-bottom shadow-sm d-flex align-items-center">
                <div className="fw-bold fs-5">Cuộc hội thoại {conversationId}</div>
            </div>

            {/* Message List */}
            <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3">
                {messages.map((msg) => (
                    <div 
                        key={msg.id} 
                        className={`d-flex flex-column ${msg.sender === 'me' ? 'align-items-end' : 'align-items-start'}`}
                    >
                        <Card 
                            className={`border-0 shadow-sm ${msg.sender === 'me' ? 'bg-primary text-white' : 'bg-white'}`}
                            style={{ maxWidth: '70%', borderRadius: '15px' }}
                        >
                            <Card.Body className="p-2 px-3">
                                {msg.text}
                            </Card.Body>
                        </Card>
                        <small className="text-muted mt-1" style={{fontSize: '0.75rem'}}>{msg.time}</small>
                    </div>
                ))}
            </div>

            {/* Input Area */}
            <div className="p-3 bg-white border-top">
                <Form onSubmit={handleSend} className="d-flex gap-2">
                    <Form.Control
                        type="text"
                        placeholder="Nhập tin nhắn..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="rounded-pill"
                    />
                    <Button type="submit" variant="primary" className="rounded-circle" style={{width: '40px', height: '40px', padding: 0}}>
                        ➤
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ChatWindow;