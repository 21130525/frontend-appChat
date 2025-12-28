import webSocketService from "./WebSocketService.ts";

interface RegisterPayload {
    user: string,
    pass: string
}

const AuthService = {
    register(payload: RegisterPayload){
        const mes = {
            action: "onchat",
            data: {
                event: 'REGISTER',
                data: {
                    user: payload.user,
                    pass: payload.pass
                }
            }
        };

        const jsonString = JSON.stringify(mes);

        webSocketService.sendMessage(jsonString);
    },

    login(payload: RegisterPayload){
        const mes = {
            action: "onchat",
            data: {
                event: 'LOGIN',
                data: {
                    user: payload.user,
                    pass: payload.pass
                }
            }
        }

        const jsonString = JSON.stringify(mes);

        webSocketService.sendMessage(jsonString);
    },

    reLogin(){
        const reLoginCode = localStorage.getItem("reLoginCode");
        if(!reLoginCode){
            return;
        }
        const mes = {
            action: "onchat",
            data: {
                event: 'RE_LOGIN',
                data: {
                    RE_LOGIN_CODE: localStorage.getItem('reLoginCode')
                }
            }
        }
        const jsonString = JSON.stringify(mes);

        webSocketService.sendMessage(jsonString);
    }
}

export default AuthService;
