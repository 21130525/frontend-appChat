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

    reLogin(user: string,code: string){
        const mes = {
            action: "onchat",
            data: {
                event: 'RE_LOGIN',
                data: {
                    user: user,
                    code: code
                }
            }
        }
        const jsonString = JSON.stringify(mes);

        webSocketService.sendMessage(jsonString);
    }
}

export default AuthService;
