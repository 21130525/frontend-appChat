import { useState } from 'react';
import { Form, ListGroup, Button, ButtonGroup, Badge, Dropdown } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts";
import { logout } from "../auth/AuthSlice.ts";
import authService from "../../services/authService.ts";

// Định nghĩa kiểu dữ liệu giả lập
interface Conversation {
    id: string;
    name: string;
    type: 'user' | 'group';
    lastMessage: string;
    unread: number;
    online?: boolean;
}

// Dữ liệu mẫu
const MOCK_CONVERSATIONS: Conversation[] = [
    { id: '1', name: 'Nguyễn Văn A', type: 'user', lastMessage: 'Hello bạn!', unread: 2, online: true },
    { id: '2', name: 'Nhóm Dev Frontend', type: 'group', lastMessage: 'Mọi người push code chưa?', unread: 5 },
    { id: '3', name: 'Trần Thị B', type: 'user', lastMessage: 'Oke nhé', unread: 0, online: false },
    { id: '4', name: 'Nhóm Gia Đình', type: 'group', lastMessage: 'Cuối tuần về quê nhé', unread: 0 },
    { id: '5', name: 'Lê Văn C', type: 'user', lastMessage: 'Đang ở đâu đấy?', unread: 1, online: true },
];

interface ChatSidebarProps {
    onSelectConversation: (id: string) => void;
    selectedId: string | null;
}

const ChatSidebar = ({ onSelectConversation, selectedId }: ChatSidebarProps) => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'user' | 'group'>('all');
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
    };

    // Logic lọc danh sách
    const filteredConversations = MOCK_CONVERSATIONS.filter((conv) => {
        const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 'all' || conv.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="d-flex flex-column h-100 border-end bg-white">
            {/* Phần thông tin người dùng hiện tại */}
            <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center overflow-hidden">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{width: '30px', height: '30px', flexShrink: 0}}>
                        {user ? user.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="fw-bold text-truncate">{user}</div>
                </div>
                <Dropdown align="end">
                    <Dropdown.Toggle variant="link" className="text-dark p-0 border-0 text-decoration-none" id="dropdown-user-settings" style={{ boxShadow: 'none' }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>
                        </svg>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item onClick={handleLogout}>Đăng xuất</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            {/* Phần Header: Search và Filter */}
            <div className="p-3 border-bottom">
                <Form.Control
                    type="search"
                    placeholder="Tìm kiếm..."
                    className="mb-3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                
                <ButtonGroup className="w-100">
                    <Button 
                        variant={filterType === 'all' ? 'primary' : 'outline-primary'} 
                        size="sm"
                        onClick={() => setFilterType('all')}
                    >
                        Tất cả
                    </Button>
                    <Button 
                        variant={filterType === 'user' ? 'primary' : 'outline-primary'} 
                        size="sm"
                        onClick={() => setFilterType('user')}
                    >
                        Người dùng
                    </Button>
                    <Button 
                        variant={filterType === 'group' ? 'primary' : 'outline-primary'} 
                        size="sm"
                        onClick={() => setFilterType('group')}
                    >
                        Nhóm
                    </Button>
                </ButtonGroup>
            </div>

            {/* Phần Danh sách (Scrollable) */}
            <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                    {filteredConversations.map((conv) => (
                        <ListGroup.Item
                            key={conv.id}
                            action
                            active={selectedId === conv.id}
                            onClick={() => onSelectConversation(conv.id)}
                            className="d-flex justify-content-between align-items-center py-3"
                        >
                            <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style={{width: '40px', height: '40px'}}>
                                        {conv.name.charAt(0)}
                                    </div>
                                    {conv.type === 'user' && conv.online && (
                                        <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>
                                    )}
                                </div>
                                <div>
                                    <div className="fw-bold text-truncate" style={{maxWidth: '150px'}}>{conv.name}</div>
                                    <small className="text-muted text-truncate d-block" style={{maxWidth: '150px'}}>{conv.lastMessage}</small>
                                </div>
                            </div>
                            {conv.unread > 0 && (
                                <Badge bg="danger" pill>
                                    {conv.unread}
                                </Badge>
                            )}
                        </ListGroup.Item>
                    ))}
                    {filteredConversations.length === 0 && (
                        <div className="text-center p-3 text-muted">Không tìm thấy kết quả</div>
                    )}
                </ListGroup>
            </div>
        </div>
    );
};

export default ChatSidebar;