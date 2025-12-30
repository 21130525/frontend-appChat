import webSocketService from "./WebSocketService.ts";

const action = "onchat"
const UserService = {
    getUserList() {
        const mes = {
            action: action,
            data: {
                event: 'GET_USER_LIST'
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    },
    checkUserOnline(user: string){
        const mes = {
            action: action,
            data: {
                event: 'CHECK_USER_ONLINE',
                data: {
                    user: user
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    },
    checkUserExist(user: string){
        const mes = {
            action: action,
            data: {
                event: 'CHECK_USER_EXIST',
                data: {
                    user: user
                }
            }
        }
        const JsonString = JSON.stringify(mes)

        webSocketService.sendMessage(JsonString)
    }

}
export default UserService;