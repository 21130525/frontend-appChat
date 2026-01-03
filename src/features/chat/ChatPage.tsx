import { useState, useEffect, useRef } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ChatSidebar from './chatSidebar/ChatSidebar.tsx';
import ChatWindow from './chatWindow/ChatWindow.tsx';
import userService from "../../services/UserService.ts";
import {useAppSelector} from "../../app/hooks.ts";
import chatService from "../../services/ChatService.ts";

const ChatPage = () => {
    const [selectedConversationName, setSelectedConversationName] = useState<string | null>(null);
    const users = useAppSelector((state)=> state.listUser)
    const isUserListLoaded = useAppSelector((state)=>state.chatRoom.isUserListLoaded)
    const hasFetchedUserList = useRef(false);
    const hasFetchedMesList = useRef(false);

    useEffect(() => {
        if (!hasFetchedUserList.current) {
            userService.getUserList();
            hasFetchedUserList.current = true;
        }
    }, []);

    useEffect(() => {
        if(!hasFetchedMesList.current && isUserListLoaded && users.length > 0){
            users.filter(u => u.type === 0).forEach(u =>{
                    chatService.getPeopleChatMes(u.name,1)
                }
            )
            hasFetchedMesList.current = true;
        }
    }, [isUserListLoaded, users]);
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
