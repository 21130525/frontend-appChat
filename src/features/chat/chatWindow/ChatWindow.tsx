import {useEffect, useMemo, useRef, useState} from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import ChatWelcome from "../ChatWelcome.tsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import chatService from "../../../services/ChatService.ts";
import { sendMessage } from "./ChatRoomSlice.ts";
import { sortUser, updateActionTime } from "../chatSidebar/UserSlice.ts";
import {getCurrentActionTime, getCurrentDateTimeSQL} from "../../../utils/DateHelper.ts";
import {encodeMessage, handleDateSendMes} from "../../../utils/ChatHelper.ts";
import EmojiHandler from './EmojiHandler.tsx';

interface ChatWindowProps {
    conversationName: string | null;
}

const ChatWindow = ({ conversationName }: ChatWindowProps) => {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user);
    const [message, setMessage] = useState('');

    const conversations = useAppSelector((state) => state.chatRoom.conversations);

    const currentConversation = conversations.find(c => c.name === conversationName);
    const messages = useMemo(() => currentConversation ? currentConversation.messages : [], [currentConversation]); // fix đúng
    const type = currentConversation?.type === 1 ? "room" : "people";

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !conversationName) return;
        const messageSend = encodeMessage(message);
        const messageShow = message
        chatService.sendChatMessage(conversationName, messageSend, type);
        const mes = {
            id: '',
            name: user ? user : '',
            type: type === "room" ? 1 : 0,
            to: conversationName,
            mes: messageShow,
            createAt: getCurrentDateTimeSQL(),
            isMe: true
        }
        dispatch(sendMessage(mes))
        dispatch(updateActionTime({ name: conversationName, actionTime: getCurrentActionTime() }))
        dispatch(sortUser())
        setMessage('');
    };

    const handleEmojiSelect = (emoji: string) => {
        setMessage(prevMessage => prevMessage + emoji);
    };

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

    const getAvatarLabel = (name: string) => name ? name.charAt(0).toUpperCase() : '?';

    return (
        <div className="d-flex flex-column h-100 bg-light">
            {/* 1. HEADER */}
            <div className="p-3 bg-white border-bottom shadow-sm d-flex align-items-center sticky-top">
                <div className="fw-bold fs-5">{conversationName}</div>
            </div>

            {/* 2. MESSAGE LIST */}
            <div className="flex-grow-1 p-3 overflow-auto">
                <div className="d-flex flex-column gap-3">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`d-flex w-100 ${msg.isMe ? 'justify-content-end' : 'justify-content-start'}`}
                        >
                            {!msg.isMe && (
                                <div className="d-flex align-items-end me-2 mb-3">
                                    <div
                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center shadow-sm"
                                        style={{ width: '32px', height: '32px', fontSize: '14px', flexShrink: 0 }}
                                    >
                                        {getAvatarLabel(msg.name)}
                                    </div>
                                </div>
                            )}
                            <div style={{ maxWidth: '75%', minWidth: '100px' }}>
                                {!msg.isMe && (
                                    <div className="text-secondary ms-1 mb-1" style={{ fontSize: '0.8rem' }}>
                                        {msg.name}
                                    </div>
                                )}
                                <div
                                    className={`p-2 ps-3 text-break shadow-sm ${
                                        msg.isMe
                                            ? 'bg-primary text-white'
                                            : 'bg-white text-dark border border-primary'
                                    }`}
                                    style={{
                                        borderRadius: '20px',
                                        borderTopLeftRadius: !msg.isMe ? '5px' : '20px',
                                        borderTopRightRadius: msg.isMe ? '5px' : '20px'
                                    }}
                                >
                                    {msg.mes}
                                </div>
                                <div className={`text-muted mt-1 ${msg.isMe ? 'text-end' : 'text-start ms-1'}`} style={{ fontSize: '0.7rem' }}>
                                    {handleDateSendMes(msg.createAt)}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* 3. INPUT AREA */}
            <div className="p-3 bg-white border-top">
                <Form onSubmit={handleSend}>
                     <InputGroup className="align-items-center">
                        <EmojiHandler onEmojiClick={handleEmojiSelect} />
                        <Form.Control
                            type="text"
                            placeholder="Nhập tin nhắn..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="rounded-pill bg-light border-0 px-3 py-2"
                            style={{ boxShadow: 'none' }}
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            className="rounded-circle d-flex align-items-center justify-content-center p-0"
                            style={{ width: '45px', height: '45px', marginLeft: '8px' }}
                        >
                            <i className="bi bi-send-fill"></i>
                        </Button>
                    </InputGroup>
                </Form>
            </div>
        </div>
    );
};

export default ChatWindow;