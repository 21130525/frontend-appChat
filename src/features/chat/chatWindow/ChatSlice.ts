import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Message {
    id: string;
    name: string;
    to: string;
    mes: string;
    createAT: string;
    isMe?: boolean;
}

export interface Conversation {
    name: string ;
    messages: Message[];
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


export const chatSlice = createSlice({
    name: "chatSlice",
    initialState: initialState,
    reducers: {
        setConversations: (state, action: PayloadAction<ResponseMessage>) => {
            const { userCurrent, messages } = action.payload;
            console.log("curentname: "+userCurrent);
            if (messages.length === 0) return;

            const otherMessage = messages.find(m => m.name !== userCurrent);
            const partnerName = otherMessage ? otherMessage.name : messages[0].to;
            console.log("partnerName"+partnerName);
            const processedMessages : Message[] =   messages.map(mgs => ({
                ...mgs,
                isMe: mgs.name === userCurrent,
            }))
            const existingConvIndex= state.conversations.findIndex(c => c.name === partnerName)

            if (existingConvIndex !== -1) {
                // CASE A: Đã tồn tại -> Cập nhật/Ghi đè messages
                state.conversations[existingConvIndex].messages = processedMessages;
            } else {
                // CASE B: Chưa tồn tại -> Tạo mới
                const newConversation: Conversation = {
                    name: partnerName,
                    messages: processedMessages
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
                    messages: [msg]
                });
            }
        }
    }
})

export const { setConversations, setUserListWasLoaded, addMessage } = chatSlice.actions;
export default chatSlice.reducer;