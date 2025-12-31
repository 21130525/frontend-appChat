import { useState } from 'react';
import { Form, ListGroup, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts";
import { logout } from "../auth/AuthSlice.ts";
import authService from "../../services/authService.ts";
import type {user} from "./UserSlice.ts";

const MOCK_CONVERSATIONS: user[] = [
    { name: 'Nguyễn Văn A', type: 0, online: true },
    { name: 'Nhóm Dev Frontend', type: 1 },
    { name: 'Trần Thị B', type: 0, online: false },
    { name: 'Nhóm Gia Đình', type: 1 },
    { name: 'Lê Văn C', type: 0, online: true },
];

interface ChatSidebarProps {
    onSelectConversation: (name: string) => void;
    selectedName: string | null;
}

const ChatSidebar = ({ onSelectConversation, selectedName }: ChatSidebarProps) => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<2 | 0 | 1>(2);

    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
    };

    const filteredConversations = MOCK_CONVERSATIONS.filter((conv) => {
        const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 2 || conv.type === filterType;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="d-flex flex-column h-100 border-end bg-white">
            {/* User Info Section */}
            <div className="p-3 border-bottom bg-light d-flex align-items-center justify-content-between">
                <div className="d-flex align-items-center overflow-hidden">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center text-white me-3" style={{width: '30px', height: '30px', flexShrink: 0}}>
                        {user && typeof user === 'string' ? user.charAt(0).toUpperCase() : 'U'}
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

            {/* Search & Filter Section */}
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
                        variant={filterType === 2 ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setFilterType(2)}
                    >
                        Tất cả
                    </Button>
                    <Button
                        variant={filterType === 0 ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setFilterType(0)}
                    >
                        Người dùng
                    </Button>
                    <Button
                        variant={filterType === 1 ? 'primary' : 'outline-primary'}
                        size="sm"
                        onClick={() => setFilterType(1)}
                    >
                        Nhóm
                    </Button>
                </ButtonGroup>
            </div>

            {/* List Section */}
            <div className="flex-grow-1 overflow-auto">
                <ListGroup variant="flush">
                    {filteredConversations.map((conv) => (
                        <ListGroup.Item
                            key={conv.name} // Sử dụng name làm key (Bắt buộc phải duy nhất)
                            action
                            active={selectedName === conv.name} // So sánh theo name
                            onClick={() => onSelectConversation(conv.name)} // Gửi name khi click
                            className="d-flex justify-content-between align-items-center py-3"
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style={{width: '40px', height: '40px'}}>
                                        {conv.name.charAt(0)}
                                    </div>
                                    {conv.type === 0 && conv.online && (
                                        <span className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"></span>
                                    )}
                                </div>
                                <div>
                                    <div className="fw-bold text-truncate" style={{maxWidth: '150px'}}>{conv.name}</div>
                                </div>
                            </div>
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