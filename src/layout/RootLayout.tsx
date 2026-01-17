import { Outlet, useNavigate } from "react-router-dom";
import {useEffect, useRef} from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Spinner } from "react-bootstrap";
import webSocketService from "../services/WebSocketService.ts";
import {handleEvent, handleServerResponse} from "../utils/HandleDataResponse.ts";
import { loginFailure, loginSuccess } from "../features/auth/AuthSlice.ts";
import { connect, disconnect } from "../features/socket/AccessSlice.ts";
import { useAppDispatch, useAppSelector } from "../app/hooks.ts";
import authService from "../services/authService.ts";
import {setUsers, sortUser, updateActionTime, updateUserStatus} from "../features/chat/chatSidebar/UserSlice.ts";
import {
    setPeopleConversations,
    setUserListWasLoaded, receiveMessage, setGroupConversations
} from "../features/chat/chatWindow/ChatRoomSlice.ts";
import {setStatus} from "../features/chat/chatSidebar/SearchSlice.ts";
import {resetWaitingForUserOnline} from "../features/chat/reciveResponsSlice.ts";
import type {
    MessageResponse,
    ResponseConversation,
    ResponseGroupConversation
} from "../features/chat/chatWindow/ChatRoomDTO.ts";
import {resetWaiting} from "../features/SliceUtils/WaitingSlice.ts";
import {setActionNotify, setAnnounce, setStatusNotify} from "../features/SliceUtils/NotificationSlice.ts";
import {addTimeToDateTimeSQL, getCurrentDateTimeSQL} from "../utils/DateHelper.ts";

// Component này sẽ luôn được mount, là nơi lý tưởng để quản lý các tác vụ nền
// như WebSocket.
export default function RootLayout() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const isConnected = useAppSelector((state) => state.connection.isConnected);

    const user = useAppSelector((state) => state.auth.user);
    const userRef = useRef(user);

    const nameToCheckOnline = useAppSelector((state) => state.checkUserOnline.name);
    const nameToCheckOnlineRef = useRef(nameToCheckOnline);


    useEffect(() => {
        userRef.current = user;
    }, [user]);
    useEffect(() => {
        nameToCheckOnlineRef.current = nameToCheckOnline;
    }, [nameToCheckOnline]);

    useEffect(() => {
        const unsubscribe = webSocketService.subscribe((event) => {
            if (event.type === 'STATUS_CHANGE') {
                if (event.payload === 'CONNECTED') {
                    dispatch(connect());
                    
                    // Tự động Re-Login khi kết nối thành công
                    const savedUsername = localStorage.getItem('username');
                    const savedReLoginCode = localStorage.getItem('reLoginCode');
                    
                    if (savedUsername && savedReLoginCode) {
                        authService.reLogin(savedUsername, savedReLoginCode);
                    }
                    
                } else if (event.payload === 'DISCONNECTED' || event.payload === 'ERROR') {
                    dispatch(disconnect());
                }
            }
            if (event.type === 'RECEIVE_MESSAGE') {
                try {
                    const data = JSON.parse(event.payload);
                    console.log('RECEIVE_MESSAGE:' + event.payload)
                    const response = handleServerResponse(data);

                    if(response === null ){
                        return;
                    }
                    const result = handleEvent(response);

                    switch (response.event) {
                        case 'LOGIN':
                        case 'RE_LOGIN': {
                            if (result) {
                                const username = localStorage.getItem('username');
                                if (username) {
                                    dispatch(loginSuccess(username));
                                    // Nếu đang ở trang login hoặc root, chuyển hướng vào chat
                                    if (window.location.pathname === '/auth/login' || window.location.pathname === '/') {
                                        navigate('/chat', { replace: true });
                                    }
                                }
                            } else {
                                // Re-login thất bại, xóa thông tin cũ
                                if (response.event === 'RE_LOGIN') {
                                    localStorage.removeItem('reLoginCode');
                                    dispatch(loginFailure());
                                }
                            }
                            break;
                        }
                        case 'GET_USER_LIST':
                            dispatch(setUsers(result));
                            dispatch(setUserListWasLoaded());

                            break;
                        case 'GET_ROOM_CHAT_MES':
                            if(response.status === 'success'){
                                // RECEIVE_MESSAGE:
                                // {"data":{
                                //     "id":1154,"name":"tuanroomtest","own":"hihi","createTime":"2026-01-06 19:27:30.0",
                                //         "userList":[{"id":1474,"name":"tuantest"},{"id":487,"name":"TestAccount"}],
                                //         "chatData":[
                                //             {"id":27071,"name":"tuantest","type":1,"to":"tuanroomtest","mes":"Hello2","createAt":"2026-01-06 19:36:07"},
                                //             {"id":27070,"name":"tuantest","type":1,"to":"tuanroomtest","mes":"Hello1","createAt":"2026-01-06 19:35:45"}
                                //         ]},
                                //     "status":"success","event":"GET_ROOM_CHAT_MES"
                                // }
                                const currentUser = userRef.current || localStorage.getItem('username') || '';
                                const userList: string[] = (data && Array.isArray(response.data.userList))
                                    ? response.data.userList.map((u:  {id: number, name: string}) => u.name)
                                    : [];
                                const res : ResponseGroupConversation  = {
                                    userCurrent: currentUser,
                                    groupName:  response.data.name as string,
                                    own: response.data.own as string,
                                    createTime: addTimeToDateTimeSQL(response.data.createTime,7*60*60),
                                    userList: userList,
                                    messages: (response.data.chatData?response.data.chatData  : []) as MessageResponse[],
                                    type: 1
                                }
                                dispatch(setGroupConversations(res))
                            }
                            break;
                        case 'GET_PEOPLE_CHAT_MES':
                            if(response.status === 'success'){
                                const currentUser = userRef.current || localStorage.getItem('username') || '';

                                const conv : ResponseConversation = {
                                    userCurrent: currentUser,
                                    messages: response.data
                                }
                                dispatch(setPeopleConversations(conv))
                            }
                            else
                                console.error("Error getting conversations...");
                            break;
                        case 'CHECK_USER_EXIST':
                            if(response.status === 'success'){
                                if(response.data.status)
                                    dispatch(setStatus(response.data.status))
                            }
                            break;
                        case 'CHECK_USER_ONLINE':
                            if(response.status === 'success'){
                                const currentName = nameToCheckOnlineRef.current;
                                if(response.data.status === true ){
                                    dispatch(updateUserStatus({name: currentName, online: true}))
                                }
                            }
                            dispatch(resetWaitingForUserOnline())
                            break;
                        case 'CREATE_ROOM':
                            // RECEIVE_MESSAGE:
                            // {"data":
                            //     {
                            //         "id":1162,"name":"nhom123","own":"hihi","createTime":"2026-01-07 07:38:02.0",
                            //         "userList":[],
                            //         "chatData":[]
                            //     },"status":"success","event":"CREATE_ROOM"
                            // }

                            if(response.status === 'success'){
                                const actionTime : string = addTimeToDateTimeSQL(response.data.createTime,7*60*60)
                                const groupName : string = response.data.name
                                const res : ResponseGroupConversation  = {
                                    userCurrent: response.data.name as string,
                                    groupName:  response.data.name as string,
                                    own: response.data.own as string,
                                    createTime: addTimeToDateTimeSQL(response.data.createTime,7*60*60),
                                    userList: [],
                                    messages: response.data.chatData as MessageResponse[],
                                    type: 1
                                }

                                dispatch(setGroupConversations(res))
                                dispatch(sortUser())
                                // dispatch(updateActionTime({name: groupName,actionTime:actionTime}))

                                dispatch(resetWaitingForUserOnline())
                                dispatch(setActionNotify('CREATE_ROOM'))
                                dispatch(setAnnounce("Tạo nhóm "+groupName+" thành công"))
                                dispatch(setStatusNotify(true))

                            }else if(response.status === 'error'){
                            //     RECEIVE_MESSAGE:{"mes":"Room Exist","event":"CREATE_ROOM","status":"error"}
                                dispatch(setActionNotify('CREATE_ROOM'))
                                dispatch(setAnnounce('Tạo nhóm không thành công' + response.mes))
                                dispatch(setStatusNotify(false))

                            }
                            dispatch(resetWaiting())

                            break;
                        case 'JOIN_ROOM':
                            // RECEIVE_MESSAGE:
                            // {
                            //     "event":"JOIN_ROOM","status":"success",
                            //     "data":{
                            //         "id":1162,"name":"nhom123","own":"hihi","createTime":"2026-01-07 07:38:02.0",
                            //         "userList":[{"id":1399,"name":"haha"}],
                            //         "chatData":[]}
                            // }
                            if(response.status === 'success') {
                                const actionTime: string =  addTimeToDateTimeSQL(response.data.createTime,7*60*60)
                                const groupName: string = response.data.name
                                dispatch(updateActionTime({name: groupName, actionTime: actionTime}))
                                const userList: string[] = (data && Array.isArray(response.data.userList))
                                ? response.data.userList.map((u: {id: number, name: string}) => u.name)
                                    : [];
                                const res : ResponseGroupConversation  = {
                                    userCurrent: response.data.name as string,
                                    groupName:  response.data.name as string,
                                    own: response.data.own as string,
                                    createTime: addTimeToDateTimeSQL(response.data.createTime,7*60*60),
                                    userList: userList,
                                    messages: response.data.chatData as MessageResponse[],
                                    type: 1
                                }
                                dispatch(setGroupConversations(res))
                                dispatch(sortUser())

                                dispatch(setActionNotify('JOIN_ROOM'))
                                dispatch(setAnnounce("Tham gia nhóm '"+groupName+"' thành công"))
                                dispatch(setStatusNotify(true))
                                dispatch(resetWaiting())

                            }
                            // RECEIVE_MESSAGE:{"event":"JOIN_ROOM","status":"error","mes":"Room not found"}
                            else{
                                dispatch(setActionNotify('JOIN_ROOM'))
                                dispatch(setAnnounce('Tham gia nhóm thất bại: ' + response.mes))
                                dispatch(setStatusNotify(false))
                                dispatch(resetWaiting())
                            }
                            break;
                        //     receive message
                        case 'SEND_CHAT':
                            // ------------------people
                            // RECEIVE_MESSAGE:
                            // {"status":"success",
                            //      "event":"SEND_CHAT",
                            //      "data":{"id":0,"name":"bb","type":0,"to":"aa","mes":"b"}}
                            // --------------room
                            // RECEIVE_MESSAGE:
                            // {"status":"success",
                            //      "event":"SEND_CHAT",
                            //      "data":{"id":0,"name":"bb","type":1,"to":"qqa","mes":"bb"}}
                            if(response.status === 'success'){
                                if(result.type === 0){
                                    dispatch(updateActionTime({name: result.name, actionTime: getCurrentDateTimeSQL()}))
                                }else {
                                    dispatch(updateActionTime({name: result.to, actionTime: getCurrentDateTimeSQL()}))
                                }
                                dispatch(sortUser())
                                dispatch(receiveMessage(response.data))
                            }
                            break;
                            //TODO add new case
                        default:
                            break;
                    }

                } catch (e) {
                    console.error('error to json parse',e)
                }
            }
        });

        // Gọi connect sau khi đã subscribe để đảm bảo bắt được sự kiện CONNECTED nếu socket đã mở sẵn
        webSocketService.connect();

        // Hàm dọn dẹp này sẽ chỉ chạy khi người dùng đóng tab trình duyệt
        return () => unsubscribe();
    }, [dispatch, navigate]);

    if (!isConnected) {
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <Spinner animation="border" variant="primary" />
                <div className="mt-3">Đang kết nối với server...</div>
            </div>
        );
    }

    return (
        <>
            <Outlet />
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
            />
        </>
    );
}
