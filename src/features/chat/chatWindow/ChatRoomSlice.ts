import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
    id: string;
    name: string;
    type: number;
    to: string;
    mes: string;
    createAt: string;
    isMe?: boolean;
}

export interface Conversation {
    name: string ;
    messages: Message[];
    type: number;
}

export interface ResponseMessage {
    userCurrent: string ;
    messages: Message[];
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
        setConversations: (state, action: PayloadAction<ResponseMessage>) => {
            const { userCurrent, messages } = action.payload;
            if (messages.length === 0) return;

            const otherMessage = messages.find(m => m.name !== userCurrent);
            const partnerName = otherMessage ? otherMessage.name : messages[0].to;

            const processedMessages : Message[] =   messages.map(mgs => ({
                ...mgs,
                isMe: mgs.name === userCurrent,
            }))

            const existingConvIndex= state.conversations.findIndex(c => c.name === partnerName)
            const type = otherMessage ? otherMessage.type : 0;
            if (existingConvIndex !== -1) {
                state.conversations[existingConvIndex].messages = processedMessages;
            } else {
                processedMessages.reverse()
                const newConversation: Conversation = {
                    name: partnerName,
                    messages: processedMessages,
                    type: type
                };
                state.conversations.push(newConversation);
            }
        },


        setUserListWasLoaded: (state) => {
            state.isUserListLoaded = true;
        },
        addMessage: (state, action: PayloadAction<Message>) => {
            const msg = action.payload;
            const targetName = msg.isMe ? msg.to : msg.name;

            const existingConv = state.conversations.find(c => c.name === targetName);

            if (existingConv) {
                // Thêm vào hội thoại có sẵn
                existingConv.messages.push(msg);
            } else {
                // Tạo hội thoại mới (Trường hợp tin nhắn đầu tiên)
                state.conversations.push({
                    name: targetName,
                    messages: [msg],
                    type: msg.type
                });
            }
        }
    }
})

export const { setConversations, setUserListWasLoaded, addMessage } = chatRoomSlice.actions;
export default chatRoomSlice.reducer;