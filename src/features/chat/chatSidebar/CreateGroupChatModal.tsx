import React, {useCallback, useEffect, useRef, useState} from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {useAppDispatch, useAppSelector} from '../../../app/hooks';
import { addUser, type User } from './UserSlice';
import chatService from "../../../services/ChatService.ts";
import {resetWaiting, setWaiting} from "../../SliceUtils/WaitingSlice.ts";
import {resetNotification} from "../../SliceUtils/NotificationSlice.ts";
import { toast } from 'react-toastify';
import {getCurrentDateTimeSQL} from "../../../utils/DateHelper.ts";

interface CreateGroupChatModalProps {
    show: boolean;
    onHide: () => void;
}

const CreateGroupChatModal: React.FC<CreateGroupChatModalProps> = ({ show, onHide }) => {
    const dispatch = useAppDispatch();
    const isWaiting = useAppSelector((state) => state.waiting.isWaiting);
    const allUsers = useAppSelector((state) => state.listUser);
    const [groupName, setGroupName] = useState('');
    const submittedGroupName = useRef<string>('');

    const actionNotify = useAppSelector((state)=> state.notification.actionNotify)
    const announce = useAppSelector((state)=> state.notification.announce)
    const statusNotify = useAppSelector((state)=> state.notification.statusNotify)

    const handleCreateGroup = () => {
        if (!groupName.trim()) {
            toast.error('Vui lòng nhập tên nhóm.');
            return;
        }
        // Xóa thông báo cũ trước khi thực hiện hành động mới để đảm bảo không bị ảnh hưởng bởi lỗi từ action khác
        submittedGroupName.current = groupName;
        dispatch(resetNotification());
        dispatch(setWaiting());
        chatService.createGroupChat(groupName);
    };

    const addUserToStore = useCallback(() => {
        const nameToAdd = submittedGroupName.current;
        // Chỉ thêm group vào store nếu nó chưa tồn tại để tránh lỗi duplicate key
        const groupExists = allUsers.some(u => u.name.toLowerCase() === nameToAdd.toLowerCase());
        if (nameToAdd && !groupExists) {
            const newGroup: User = {
                name: nameToAdd,
                type: 1,
                actionTime: getCurrentDateTimeSQL(),
            };
            dispatch(addUser(newGroup));
        }
    }, [dispatch, allUsers]);

    useEffect(() => {
        if (isWaiting || actionNotify !== 'CREATE_ROOM') {
            return;
        }

        if (statusNotify) { // Trường hợp thành công
            addUserToStore();
            toast.success(announce);
        } else { // Trường hợp thất bại
            toast.error(announce);
        }
        // Dọn dẹp và đóng modal ngay sau khi hiển thị toast
        dispatch(resetNotification());
        dispatch(resetWaiting());
        onHide();
    }, [isWaiting, actionNotify, announce, statusNotify, addUserToStore, onHide, dispatch]);

    // Reset local state when modal is hidden to prevent showing old data
    useEffect(() => {
        if (!show) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setGroupName('');
            submittedGroupName.current = '';
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tạo nhóm chat mới</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tên nhóm</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Nhập tên nhóm..."
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="primary" onClick={handleCreateGroup} disabled={!groupName.trim() || isWaiting }>
                    Tạo nhóm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default CreateGroupChatModal;