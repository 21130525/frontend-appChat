import {useEffect, useRef, useState} from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import ChatWelcome from "../ChatWelcome.tsx";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import chatService from "../../../services/ChatService.ts";
import {sendMessage} from "./ChatRoomSlice.ts";

interface ChatWindowProps {
    conversationName: string | null;
}

const ChatWindow = ({ conversationName }: ChatWindowProps) => {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user);
    const [message, setMessage] = useState('');
    const conversations = useAppSelector((state) => state.chatRoom.conversations);

    // Lấy tin nhắn của hội thoại hiện tại
    const currentConversation = conversations.find(c => c.name === conversationName);
    // danh sách tin nhắn
    const messages = currentConversation ? currentConversation.messages : [];
    // là nhóm hay là người
    const type = currentConversation?.type ===1 ? "room": "people";
    // quản lý gủi tin nhắn
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !conversationName) return;
        chatService.sendChatMessage(conversationName, message, type);
        const mes =  {
            id: '',
            name: user?user:'',
            type: currentConversation?.type?currentConversation.type:0,
            to: conversationName,
            mes: message,
            createAt: new Date().toLocaleString(),
            isMe: true
        }
        dispatch(sendMessage(mes))
        setMessage('');
    };
    // animation scroll khi gửi tin nhắn
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    if (!conversationName) {
        return <ChatWelcome />;
    }

    return (
        <div className="d-flex flex-column h-100 bg-light">
            {/* Header */}
            <div className="p-3 bg-white border-bottom shadow-sm d-flex align-items-center">
                <div className="fw-bold fs-5">{conversationName}</div>
            </div>

            {/* Message List */}
            <div className="flex-grow-1 p-3 overflow-auto d-flex flex-column gap-3">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`d-flex flex-column ${msg.isMe ? 'align-items-end' : 'align-items-start'}`}
                    >
                        <Card
                            className={`border-0 shadow-sm ${msg.isMe ? 'bg-primary text-white' : 'bg-white'}`}
                            style={{ maxWidth: '70%', borderRadius: '15px' }}
                        >
                            <Card.Body className="p-2 px-3">
                                {msg.mes}
                            </Card.Body>
                        </Card>
                        <small className="text-muted mt-1" style={{ fontSize: '0.75rem' }}>
                            {
                                msg.createAt
                            }
                        </small>
                    </div>
                ))}
                <div ref={messagesEndRef} />
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
                    <Button type="submit" variant="primary" className="rounded-circle" style={{ width: '40px', height: '40px', padding: 0 }}>
                        ➤
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ChatWindow;