import React, {useCallback, useEffect, useRef, useState} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {useAppDispatch, useAppSelector} from "../../../app/hooks.ts";
import chatService from "../../../services/ChatService.ts";
import {addUser, type User} from "./UserSlice.ts";
import {resetWaiting, setWaiting} from "../../SliceUtils/WaitingSlice.ts";
import {resetNotification} from "../../SliceUtils/NotificationSlice.ts";
import { toast } from 'react-toastify';
import {getCurrentDateTimeSQL} from "../../../utils/DateHelper.ts";

interface JoinGroupChatModalProps {
    show: boolean;
    onHide: () => void;
}

const JoinGroupChatModal: React.FC<JoinGroupChatModalProps> = ({show, onHide}) => {
    const dispatch = useAppDispatch();
    const [groupName, setGroupName] = useState('');
    const allUsers = useAppSelector((state) => state.listUser);
    const isWaiting = useAppSelector((state) => state.waiting.isWaiting);
    const submittedGroupName = useRef<string>('');

    const actionNotify = useAppSelector((state) => state.notification.actionNotify);
    const announce = useAppSelector((state) => state.notification.announce);
    const statusNotify = useAppSelector((state) => state.notification.statusNotify);

    const handleJoinGroup = () => {
        if (!groupName.trim()) {
            toast.error('Vui lòng nhập tên nhóm.');
            return;
        }
        submittedGroupName.current = groupName;
        dispatch(resetNotification());
        dispatch(setWaiting());
        chatService.joinGroupChat(groupName);
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
        if (isWaiting || actionNotify !== 'JOIN_ROOM') {
            return;
        }

        if (statusNotify) { // Success case
            addUserToStore();
            toast.success(announce);
        } else { // Failure case
            toast.error(announce);
        }
        // Dọn dẹp và đóng modal ngay sau khi hiển thị toast
        dispatch(resetNotification());
        dispatch(resetWaiting());
        onHide();
    }, [isWaiting, actionNotify, announce, statusNotify, addUserToStore, onHide, dispatch]);

    // Reset local state when modal is hidden
    useEffect(() => {
        if (!show) {
            setGroupName('');
            submittedGroupName.current = '';
        }
    }, [show]);

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Tham gia nhóm chat</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3">
                    <Form.Label>Tên nhóm</Form.Label>
                    <Form.Control type="text" placeholder="Nhập tên nhóm..." value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="primary" onClick={handleJoinGroup} disabled={!groupName.trim() || isWaiting}>
                    Tham gia
                </Button>
            </Modal.Footer>
        </Modal>
    )
}
export default JoinGroupChatModal;