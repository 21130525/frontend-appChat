import { useState } from 'react';
import { Form, ListGroup, Button, ButtonGroup, Dropdown } from 'react-bootstrap';
import { useAppSelector, useAppDispatch } from "../../app/hooks.ts";
import { logout } from "../auth/AuthSlice.ts";
import authService from "../../services/authService.ts";

interface ChatSidebarProps {
    onSelectConversation: (name: string) => void;
    selectedName: string | null;
}

const ChatSidebar = ({ onSelectConversation, selectedName }: ChatSidebarProps) => {
    const dispatch = useAppDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<2 | 0 | 1>(2);

    const currentUser = useAppSelector((state) => state.auth.user);
    // Sửa selector: state.listUser chính là mảng User[]
    const users = useAppSelector((state) => state.listUser);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
    };

    // Lọc danh sách user từ Redux store thay vì Mock data
    const filteredConversations = users.filter((conv) => {
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
                        {currentUser && typeof currentUser === 'string' ? currentUser.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="fw-bold text-truncate">{currentUser}</div>
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
                            key={conv.name}
                            action
                            active={selectedName === conv.name}
                            onClick={() => onSelectConversation(conv.name)}
                            className="d-flex justify-content-between align-items-center py-3"
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="d-flex align-items-center">
                                <div className="position-relative me-3">
                                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center text-white" style={{width: '40px', height: '40px'}}>
                                        {conv.name.charAt(0).toUpperCase()}
                                    </div>
                                    {/* Hiển thị trạng thái online nếu là User (type 0) */}
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
