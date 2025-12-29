interface ServerResponse {
    status: 'success' | 'error' | 'warning';
    event: 'LOGIN' | 'LOGOUT' | 'ERROR' | string;
    data?: any;
    mes?: string;
}

export function handleServerResponse(payload: string | object): any {
    try {
        let response: ServerResponse;
        if (typeof payload === 'string') {
            try {
                response = JSON.parse(payload);
            } catch (e) {
                console.error("Lỗi: Chuỗi JSON không hợp lệ."+e);
                return null;
            }
        } else {
            response = payload as ServerResponse;
        }
        const { status, event, data, mes } = response;
        switch (event){
            // Gộp các trường hợp có logic giống hệt nhau để tránh lặp code
            case 'REGISTER':
            case 'LOGIN':
            case 'RE_LOGIN':
                if(status === 'success' && data?.RE_LOGIN_CODE){
                    localStorage.setItem('reLoginCode', data.RE_LOGIN_CODE);
                    return data.RE_LOGIN_CODE;
                }else{
                    return null;
                }
            default:
                console.log(mes)
                return null;
        }
    } catch (error) {
        console.error("System Error:", error);
        return null;
    }
}
