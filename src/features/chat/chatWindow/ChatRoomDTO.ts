export interface Message {
    id: string;
    name: string;
    type: number;
    to: string;
    mes: string;
    createAt: string;
    isMe: boolean;
}

interface BaseConversation {
    name: string;
    messages: Message[];
}
export interface GroupConversation extends BaseConversation {
    userList: string[];
    own: string;
    createTime: string;
    type: 1;
}
interface PeopleConversation extends BaseConversation {
    type: 0;
}

export type Conversation = GroupConversation | PeopleConversation;

export interface ResponseGroupConversation extends ResponseConversation{
    groupName: string;
    own: string;
    createTime: string;
    userList: string[];
    type : 1,
}

export interface ChatRoom {
    isUserListLoaded: boolean;
    conversations: Conversation[];
}

export interface MessageResponse {
    id: string;
    name: string;
    type: number;
    to: string;
    mes: string;
    createAt: string;
}

export interface ChatResponse {
    id: string;
    name: string,
    type: number;
    to: string;
    mes: string;
}

export interface ResponseMessage {
    userCurrent: string;
    message: ChatResponse;
}

export interface ResponseConversation {
    userCurrent: string;
    messages: MessageResponse[];
}
