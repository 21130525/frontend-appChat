import webSocketService from "./WebSocketService.ts";

const action = "onchat"
const ChatService = {
    sendChatMessage(user: string, message: string,type: string) {
        const mes = {
            action: action,
            data: {
                event: 'SEND_CHAT',
                data: {
                    type: type,
                    to: user,
                    mes: message,
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)

    },
    getRoomChatMes(room: string,page: number){
        const mes = {
            action: action,
            data: {
                event: 'GET_ROOM_CHAT_MES',
                data: {
                    name: room,
                    page: page
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    },
    getPeopleChatMes(user: string,page: number){
        const mes = {
            action: action,
            data: {
                event: 'GET_PEOPLE_CHAT_MES',
                data: {
                    name: user,
                    page: page
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    },

    createGroupChat(groupName: string) {
        const mes = {
            action: action,
            data: {
                event: 'CREATE_ROOM',
                data: {
                    name: groupName,
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    },
    joinGroupChat(groupName: string) {
        const mes = {
            action: action,
            data: {
                event: 'JOIN_ROOM',
                data: {
                    name: groupName,
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    }
}
export default ChatService;