import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';
import userService from "../../services/UserService.ts";

const ChatPage = () => {
    const [selectedConversationName, setSelectedConversationName] = useState<string | null>(null);
    const hasFetchedUserList = useRef(false);

    useEffect(() => {
        // Kiểm tra nếu đã fetch rồi thì không fetch lại
        if (!hasFetchedUserList.current) {
            userService.getUserList();
            hasFetchedUserList.current = true;
        }
    }, []);

    return (
        <Container fluid className="p-0 h-100">
            <Row className="g-0 h-100">
                {/* Cột trái: Danh sách (3 phần) */}
                <Col md={4} lg={3} className="h-100 border-end">
                    <ChatSidebar onSelectConversation={setSelectedConversationName} selectedName={selectedConversationName} />
                </Col>
                
                {/* Cột phải: Chat (9 phần) */}
                <Col md={8} lg={9} className="h-100">
                    <ChatWindow conversationName={selectedConversationName} />
                </Col>
            </Row>
        </Container>
    );
};

export default ChatPage;
