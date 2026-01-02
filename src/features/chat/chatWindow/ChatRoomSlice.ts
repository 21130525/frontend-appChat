import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

export interface Message {
    id: string;
    name: string;
    type: number;
    to: string;
    mes: string;
    createAt: string;
    isMe: boolean;
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
    type: number;
    to: string;
    mes: string;
    createAt: string;
}

export interface Conversation {
    name: string;
    messages: Message[];
    type: number;
}

export interface ResponseConversation {
    userCurrent: string;
    messages: MessageResponse[];
}

export interface ResponseMessage {
    userCurrent: string;
    message: ChatResponse;
}

export interface ChatRoom {
    isUserListLoaded: boolean;
    conversations: Conversation[];
}

const initialState: ChatRoom = {
    isUserListLoaded: false,
    conversations: [],
}

export const chatRoomSlice = createSlice({
    name: "chatSlice",
    initialState: initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<ResponseConversation>) => {
            const { userCurrent, messages } = action.payload;
            if (messages.length === 0) return;

            const otherMessage = messages.find(m => m.name !== userCurrent);
            const partnerName = otherMessage ? otherMessage.name : messages[0].to;

            const processedMessages: Message[] = messages.map(msg => ({
                ...msg,
                isMe: msg.name === userCurrent,
            }));
            processedMessages.sort((a, b) => {
                const dateA = new Date(a.createAt.replace(" ", "T") + "Z").getTime();
                const dateB = new Date(b.createAt.replace(" ", "T") + "Z").getTime();

                return (dateB || 0) - (dateA || 0);
            });

            const existingConvIndex = state.conversations.findIndex(c => c.name === partnerName);
            const conversationType = otherMessage ? otherMessage.type : messages[0].type;

            if (existingConvIndex !== -1) {
                state.conversations[existingConvIndex].messages = processedMessages;
            } else {
                processedMessages.reverse();
                const newConversation: Conversation = {
                    name: partnerName,
                    messages: processedMessages,
                    type: conversationType
                };
                state.conversations.push(newConversation);
            }
        },

        setUserListWasLoaded: (state) => {
            state.isUserListLoaded = true;
        },

        sendMessage: (state, action: PayloadAction<Message>) => {
            const message = action.payload;
            const partnerName = message.to;

            const existingConv = state.conversations.find(c => c.name === partnerName);

            if (existingConv) {
                existingConv.messages.push(message);
            } else {
                state.conversations.push({
                    name: partnerName,
                    messages: [message],
                    type: message.type
                });
            }
        },
        receiveMessage: (state, action: PayloadAction<ResponseMessage>) => {
            const {userCurrent, message} = action.payload;

            const partnerName = message.to;

            const processedMessage: Message = {
                id: message.id,
                name: userCurrent,
                type: message.type,
                to: message.to,
                mes: message.mes,
                createAt: message.createAt,
                isMe: false
            };

            const existingConv = state.conversations.find(c => c.name === partnerName);

            if (existingConv) {
                existingConv.messages.push(processedMessage);
            } else {
                state.conversations.push({
                    name: partnerName,
                    messages: [processedMessage],
                    type: message.type
                });
            }
        }
    }
})

export const {setConversations, setUserListWasLoaded, sendMessage, receiveMessage} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;