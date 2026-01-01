interface ServerResponse {
    status: 'success' | 'error' | 'warning';
    event: 'LOGIN' | 'LOGOUT' | 'ERROR' | string;
    data?: any;
    mes?: string;
}

export function handleServerResponse(payload: string | object): ServerResponse | null  {
    try {
        let response: ServerResponse;
        if (typeof payload === 'string') {
            try {
                response = JSON.parse(payload);
            } catch (e) {
                console.error("handleServerResponse Lỗi: Chuỗi JSON không hợp lệ."+e);
                return null;
            }
        } else {
            response = payload as ServerResponse;
        }
        return response;
    } catch (error) {
        console.error("handleServerResponse:", error);
        return null;
    }
}

export function handleEvent(response: ServerResponse): any{
    const { status, event, data, mes } = response;
    switch (event){
        case 'REGISTER':
            if(status === 'success' && data === 'Creating a successful account'){
                return 'success';
            }
            return null;
        case 'LOGIN':
        case 'RE_LOGIN':
            if(status === 'success' && data?.RE_LOGIN_CODE){
                localStorage.setItem('reLoginCode', data.RE_LOGIN_CODE);
                return data.RE_LOGIN_CODE;
            }else{
                return null;
            }
        case 'GET_USER_LIST':{
            return data;
        }
        case 'GET_PEOPLE_CHAT_MES':
            return data;
        default:
            console.log('handleEvent'+mes)
            return null;
    }
}
