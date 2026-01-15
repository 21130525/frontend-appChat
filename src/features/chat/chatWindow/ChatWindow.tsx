import {useEffect, useMemo, useRef, useState} from 'react';
import { Button, Form, Dropdown } from 'react-bootstrap';
import ChatWelcome from "../ChatWelcome.tsx";
import { useAppDispatch, useAppSelector } from "../../../app/hooks.ts";
import chatService from "../../../services/ChatService.ts";
import { sendMessage } from "./ChatRoomSlice.ts";
import { sortUser, updateActionTime } from "../chatSidebar/UserSlice.ts";
import {getCurrentActionTime, getCurrentDateTimeSQL} from "../../../utils/DateHelper.ts";
import { handleDateSendMes} from "../../../utils/ChatHelper.ts";
import { uploadToCloudinary } from "../../../services/CloudinaryService.ts";

interface ChatWindowProps {
    conversationName: string | null;
}

const ChatWindow = ({ conversationName }: ChatWindowProps) => {
    const dispatch = useAppDispatch()
    const user = useAppSelector((state) => state.auth.user);
    const [message, setMessage] = useState('');
    const conversations = useAppSelector((state) => state.chatRoom.conversations);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    const currentConversation = conversations.find(c => c.name === conversationName);
    const messages = useMemo(() => currentConversation ? currentConversation.messages : [], [currentConversation]); // fix đúng 
    const type = currentConversation?.type === 1 ? "room" : "people";

    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim() || !conversationName) return;
        chatService.sendChatMessage(conversationName, message, type);
        const mes = {
            id: '',
            name: user ? user : '',
            type: type === "room" ? 1 : 0,
            to: conversationName,
            mes: message,
            createAt: getCurrentDateTimeSQL(),
            isMe: true
        }
        dispatch(sendMessage(mes))
        dispatch(updateActionTime({ name: conversationName, actionTime: getCurrentActionTime() }))
        dispatch(sortUser())
        setMessage('');
    };

    const handleFileSelect = async (file: File, fileType: 'image' | 'video') => {
        if (!conversationName) return;

        try {
            // 1. Upload file lên Cloudinary, nhận về URL
            const mediaUrl = await uploadToCloudinary(file, fileType);
            console.log("Media URL from Cloudinary:", mediaUrl);

            // 2. Đóng gói message theo format cũ nhưng chỉ chứa URL
            const prefix = fileType === 'image' ? 'IMAGE:' : 'VIDEO:';
            const messageContent = prefix + mediaUrl;

            // 3. Gửi qua WebSocket
            chatService.sendChatMessage(conversationName, messageContent, type);

            // 4. Cập nhật UI local
            const mes = {
                id: '',
                name: user ? user : '',
                type: type === "room" ? 1 : 0,
                to: conversationName,
                mes: messageContent,
                createAt: getCurrentDateTimeSQL(),
                isMe: true
            };
            dispatch(sendMessage(mes));
            dispatch(updateActionTime({ name: conversationName, actionTime: getCurrentActionTime() }));
            dispatch(sortUser());
        } catch (error) {
            console.error("Upload media thất bại:", error);
            window.alert("Upload ảnh/video lên Cloudinary thất bại. Mở F12 → Console để xem chi tiết.");
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file, 'image');
        }
        if (e.target) e.target.value = '';
    };

    const checkVideoDuration = (file: File): Promise<number> => {
        return new Promise((resolve, reject) => {
            const video = document.createElement('video');
            const url = URL.createObjectURL(file);
            
            video.addEventListener('loadedmetadata', () => {
                URL.revokeObjectURL(url);
                resolve(video.duration);
            });
            
            video.addEventListener('error', () => {
                URL.revokeObjectURL(url);
                reject(new Error('Không thể đọc video'));
            });
            
            video.src = url;
        });
    };

    const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('video/')) {
            try {
                // Kiểm tra độ dài video (tối đa 70 giây = 1 phút 10 giây)
                const duration = await checkVideoDuration(file);
                const maxDuration = 70; // 1 phút 10 giây
                
                if (duration > maxDuration) {
                    const minutes = Math.floor(duration / 60);
                    const seconds = Math.floor(duration % 60);
                    window.alert(`Video quá dài! Video của bạn dài ${minutes} phút ${seconds} giây. Chỉ cho phép video tối đa 1 phút 10 giây.`);
                    if (e.target) e.target.value = '';
                    return;
                }
                
                // Nếu video hợp lệ, tiếp tục upload
                handleFileSelect(file, 'video');
            } catch (error) {
                console.error("Lỗi kiểm tra video:", error);
                window.alert("Không thể đọc file video. Vui lòng thử lại.");
                if (e.target) e.target.value = '';
            }
        }
        if (e.target) e.target.value = '';
    };

    const isImageMessage = (mes: string) => mes.startsWith('IMAGE:');
    const isVideoMessage = (mes: string) => mes.startsWith('VIDEO:');
    const getMediaUrl = (mes: string) => {
        if (isImageMessage(mes)) return mes.substring(6);
        if (isVideoMessage(mes)) return mes.substring(6);
        return '';
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

    // Helper tạo avatar chữ cái
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
                            {/* --- PHẦN AVATAR (Chỉ hiện cho người khác) --- */}
                            {!msg.isMe && (
                                <div className="d-flex align-items-end me-2 mb-3">
                                    {/* mb-3 để avatar cao ngang dòng cuối của text */}
                                    <div
                                        className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center shadow-sm"
                                        style={{ width: '32px', height: '32px', fontSize: '14px', flexShrink: 0 }}
                                    >
                                        {getAvatarLabel(msg.name)}
                                    </div>
                                </div>
                            )}

                            {/* --- PHẦN NỘI DUNG --- */}
                            <div style={{ maxWidth: '75%', minWidth: '100px' }}>

                                {/* Tên người gửi (Chỉ hiện cho người khác) - Nằm ngoài bong bóng */}
                                {!msg.isMe && (
                                    <div className="text-secondary ms-1 mb-1" style={{ fontSize: '0.8rem' }}>
                                        {msg.name}
                                    </div>
                                )}

                                {/* Bong bóng Chat */}
                                <div
                                    className={`text-break shadow-sm ${
                                        isImageMessage(msg.mes) || isVideoMessage(msg.mes)
                                            ? ''
                                            : msg.isMe
                                                ? 'bg-primary text-white p-2 ps-3'
                                                : 'bg-white text-dark border border-primary p-2 ps-3'
                                    }`}
                                    style={{
                                        borderRadius: isImageMessage(msg.mes) || isVideoMessage(msg.mes) ? '10px' : '20px',
                                        // borderTopLeftRadius: !msg.isMe && !isImageMessage(msg.mes) && !isVideoMessage(msg.mes) ? '5px' : '10px',
                                        // borderTopRightRadius: msg.isMe && !isImageMessage(msg.mes) && !isVideoMessage(msg.mes) ? '5px' : '10px',
                                        maxWidth: '100%',
                                        overflow: 'hidden'
                                    }}
                                >
                                    {isImageMessage(msg.mes) ? (
                                        <img 
                                            src={getMediaUrl(msg.mes)} 
                                            alt="Sent image" 
                                            style={{ 
                                                maxWidth: '300px', 
                                                maxHeight: '400px', 
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block',
                                                objectFit: 'contain'
                                            }} 
                                        />
                                    ) : isVideoMessage(msg.mes) ? (
                                        <video 
                                            src={getMediaUrl(msg.mes)} 
                                            controls 
                                            style={{ 
                                                maxWidth: '300px', 
                                                maxHeight: '400px', 
                                                width: '100%',
                                                height: 'auto',
                                                display: 'block'
                                            }}
                                        />
                                    ) : (
                                        msg.mes
                                    )}
                                </div>

                                {/* Thời gian - Nằm dưới bong bóng */}
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
                <Form onSubmit={handleSend} className="d-flex gap-2 align-items-center">
                    {/* Nút + (plus) menu */}
                    <Dropdown>
                        <Dropdown.Toggle
                            variant="light"
                            className="rounded-circle d-flex align-items-center justify-content-center p-0 border-0"
                            style={{ width: '45px', height: '45px' }}
                        >
                            <i className="bi bi-plus-lg"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => imageInputRef.current?.click()}>
                                <i className="bi bi-image me-2"></i>
                                Gửi ảnh
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => videoInputRef.current?.click()}>
                                <i className="bi bi-camera-video me-2"></i>
                                Gửi video
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>

                    {/* Input file ẩn cho ảnh */}
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleImageSelect}
                    />

                    {/* Input file ẩn cho video */}
                    <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/*"
                        style={{ display: 'none' }}
                        onChange={handleVideoSelect}
                    />

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
                        style={{ width: '45px', height: '45px' }}
                    >
                        <i className="bi bi-send-fill"></i>
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default ChatWindow;
