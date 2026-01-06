import {useEffect, useRef, useState} from 'react';
import {Button, ButtonGroup, Dropdown, Form, InputGroup, ListGroup} from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import {logout} from "../../auth/AuthSlice.ts";
import authService from "../../../services/authService.ts";
import UserService from "../../../services/UserService.ts";
import {resetSearchData, setSearchTerm} from "./SearchSlice.ts";
import {addUser, type User} from "./UserSlice.ts";
import useInterval from "../../../app/useInterval.ts";
import {resetReceivePrestates, setEndTask, setNameToCheckOnline, setWaiting} from "../reciveResponsSlice.ts"; // Import UserService

interface ChatSidebarProps {
    onSelectConversation: (name: string) => void;
    selectedName: string | null;
}

const ChatSidebar = ({ onSelectConversation, selectedName }: ChatSidebarProps) => {
    const dispatch = useAppDispatch();
    const searchTerm = useAppSelector((state) => state.search.searchTerm);
    const status = useAppSelector((state) => state.search.status);
    // 0: people, 1: group, 2: all
    const [filterType, setFilterType] = useState<0 | 1 | 2>(2);

    const currentUser = useAppSelector((state) => state.auth.user);
    const users = useAppSelector((state) => state.listUser);
    const isWaiting = useAppSelector((state) => state.checkUserOnline.isWaiting);
    const checkOnLineQueue= useRef<User[]>([]);

    const handleLogout = () => {
        authService.logout();
        dispatch(logout());
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== '') {
            UserService.checkUserExist(searchTerm);
        }
    };
    // filter user
    const filteredConversations = users.filter((conv) => {
        const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterType === 2 || conv.type === filterType;
        return matchesSearch && matchesFilter;
    });
    // function search user
    useEffect(() => {
        if(status === true){
            const user:User = {
                name: searchTerm,
                type: 0,
                actionTime: Date.now().toString(),
            }
            dispatch(addUser(user))
            dispatch(resetSearchData())
        }
    }, [dispatch, searchTerm, status]);
    // function search user
    useEffect(() => {
        if(status === true){
            const user:User = {
                name: searchTerm,
                type: 0,
                actionTime: Date.now().toString(),
            }
            dispatch(addUser(user))
            dispatch(resetSearchData())
        }
    }, [dispatch, searchTerm, status]);
    // check user online

    const handleCheckUserOnline = () => {
        dispatch(resetReceivePrestates())
        checkOnLineQueue.current =  users.filter(u => u.type === 0);
        processCheckOnLineQueue()
    }
    // check user online
    const processCheckOnLineQueue = () => {
        if(checkOnLineQueue.current.length > 0 && !isWaiting){
            const user = checkOnLineQueue.current[0];
            dispatch(setNameToCheckOnline(user.name))
            dispatch(setWaiting())
            UserService.checkUserOnline(user.name);
            checkOnLineQueue.current  = checkOnLineQueue.current.slice(1)
        }
        if(checkOnLineQueue.current.length  === 0){
            dispatch(setEndTask())
        }
    }

    useEffect(() => {
        handleCheckUserOnline()
    }, []);

    // run after every minute
    useInterval(handleCheckUserOnline,30000);

    // Process checkOnLineQueue
    useEffect(() => {
        if( !isWaiting){
            processCheckOnLineQueue()
        }
    }, [isWaiting]);


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
                <InputGroup className="mb-3">
                    <Form.Control
                        type="search"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    />
                    <Button variant="outline-secondary" onClick={handleSearch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                    </Button>
                </InputGroup>

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
                                    <div className={`bg-secondary  d-flex align-items-center justify-content-center text-white ${conv.type === 0  ? 'rounded-circle' : 'rounded'} `} style={{width: '40px', height: '40px'}}>
                                        {conv.name.charAt(0).toUpperCase()}
                                        <div
                                            className="d-flex align-items-center justify-content-center bg-white rounded-circle text-primary"
                                            style={{
                                                position: 'absolute',
                                                bottom: '-5px', left: '-5px',
                                                width: '16px', height: '16px',
                                                border: '1px solid #dee2e6'
                                            }}
                                        >
                                            <i style={{ fontSize: '10px' }} className={conv?.type === 0 ? "bi bi-person-fill" : "bi bi-people-fill"}>
                                            </i>
                                        </div>
                                    </div>
                                    {/* Hiển thị trạng thái online nếu là User (type 0) */}
                                    {/*{conv.type === 0 && conv.online && (*/}
                                        <span
                                            className="position-absolute bottom-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle"
                                            style={{
                                                width: '12px', // Tăng kích thước lên một chút cho dễ nhìn
                                                height: '12px',
                                                borderWidth: '2px', // Viền trắng ngăn cách (giảm xuống 2px cho cân đối)
                                                boxShadow: '0 0 0 1px #adb5bd'
                                            }}
                                        ></span>
                                    {/*)}*/}
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