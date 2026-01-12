import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {
    ChatResponse,
    ChatRoom,
    Conversation,
    Message,
    ResponseConversation,
    ResponseGroupConversation,
} from "./ChatRoomDTO.ts";
import {processAndSortMessages} from "../../../utils/ChatHelper.ts";
import {addTimeToDateTimeSQL, getCurrentDateTimeSQL, parseMessageDate} from "../../../utils/DateHelper.ts";

const initialState: ChatRoom = {
    isUserListLoaded: false,
    conversations: [],
}

export const chatRoomSlice = createSlice({
    name: "chatSlice",
    initialState: initialState,
    reducers: {
        setPeopleConversations: (state, action: PayloadAction<ResponseConversation>) => {
            const { userCurrent, messages } = action.payload;
            if (messages.length === 0) return;

            const otherMessage = messages.find(m => m.name !== userCurrent);
            const partnerName = otherMessage ? otherMessage.name : messages[0].to;

            const processedMessages: Message[] = processAndSortMessages(messages, userCurrent)

            const existingConvIndex = state.conversations.findIndex(c => c.name === partnerName);

            if (existingConvIndex !== -1) {
                state.conversations[existingConvIndex].messages = processedMessages;
                return state.conversations.forEach(conv => {
                    conv.messages.sort((a, b) => {
                        const timeA = parseMessageDate(a.createAt);
                        const timeB = parseMessageDate(b.createAt);
                        return timeA - timeB;
                    }).forEach(m => m.createAt = addTimeToDateTimeSQL(m.createAt,7*60*60));
                })
            } else {
                processedMessages.sort((a, b) => {
                    const timeA = parseMessageDate(a.createAt);
                    const timeB = parseMessageDate(b.createAt);
                    return timeA - timeB;
                }).forEach(m => m.createAt = addTimeToDateTimeSQL(m.createAt,7*60*60));

                const newConversation : Conversation = {
                    name: partnerName,
                    messages: processedMessages,
                    type: 0
                };

                state.conversations.push(newConversation);
            }
        },
        setGroupConversations: (state, action: PayloadAction<ResponseGroupConversation>) => {
            const { groupName,userCurrent, own, createTime, userList, messages } = action.payload;
            const processedMessages: Message[] = processAndSortMessages(messages, userCurrent);
            const existingConvIndex = state.conversations.findIndex(c => c.name === groupName);


            if (existingConvIndex !== -1) {
                state.conversations[existingConvIndex].messages = processedMessages;
                return state.conversations.forEach(conv => {
                    conv.messages.sort((a, b) => {
                        const timeA = parseMessageDate(a.createAt);
                        const timeB = parseMessageDate(b.createAt);
                        return timeA - timeB;
                    }).forEach(m => m.createAt = addTimeToDateTimeSQL(m.createAt,7*60*60));
                })
            } else {
                processedMessages.sort((a, b) => {
                    const timeA = parseMessageDate(a.createAt);
                    const timeB = parseMessageDate(b.createAt);
                    return timeA - timeB;
                }).forEach(m => m.createAt = addTimeToDateTimeSQL(m.createAt,7*60*60));
                const newConversation: Conversation = {
                    name: groupName,
                    type: 1,
                    own: own,
                    userList: userList,
                    createTime: createTime,
                    messages: processedMessages,
                }
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
                if (message.type === 1) {
                    state.conversations.push({
                        name: partnerName,
                        messages: [message],
                        type: 1,
                        own: "", userList: [], createTime: "" // Mặc định
                    });
                } else {
                    state.conversations.push({
                        name: partnerName,
                        messages: [message],
                        type: 0
                    });
                }
            }
        },
        receiveMessage: (state, action: PayloadAction<ChatResponse>) => {
            // {"id":0,"name":"haha","type":0,"to":"hihi","mes":"5"},"status":"success","event":"SEND_CHAT"}

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
            const message = action.payload;
            let partnerName = '';
            if (message.type === 1) {
                partnerName = message.to;
            } else {
                partnerName = message.name;
            }

            const processedMessage: Message = {
                id: message.id,
                name: message.name,
                type: message.type,
                to: message.to,
                mes: message.mes,
                createAt: getCurrentDateTimeSQL(),
                isMe: false
            };
            console.log("received message2", processedMessage);

            const existingConv = state.conversations.find(c => c.name === partnerName);

            if (existingConv) {
                existingConv.messages.push(processedMessage);
            } else {
                const msgType = message.type as 0 | 1;
                if (msgType === 1) {
                    state.conversations.push({
                        name: partnerName,
                        messages: [processedMessage],
                        type: 1,
                        own: "", userList: [], createTime: ""
                    });
                } else {
                    state.conversations.push({
                        name: partnerName,
                        messages: [processedMessage],
                        type: 0
                    });
                }
            }
        },
    }
})

export const {setPeopleConversations, setGroupConversations, setUserListWasLoaded, sendMessage, receiveMessage} = chatRoomSlice.actions;
export default chatRoomSlice.reducer;