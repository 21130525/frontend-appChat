import { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatSidebar from './ChatSidebar';
import ChatWindow from './ChatWindow';

const ChatPage = () => {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);

    return (
        <Container fluid className="p-0 h-100">
            <Row className="g-0 h-100">
                {/* Cột trái: Danh sách (3 phần) */}
                <Col md={4} lg={3} className="h-100 border-end">
                    <ChatSidebar onSelectConversation={setSelectedConversationId} selectedId={selectedConversationId} />
                </Col>
                
                {/* Cột phải: Chat (9 phần) */}
                <Col md={8} lg={9} className="h-100">
                    <ChatWindow conversationId={selectedConversationId} />
                </Col>
            </Row>
        </Container>
    );
};

export default ChatPage;