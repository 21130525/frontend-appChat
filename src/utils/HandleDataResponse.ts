interface ServerResponse {
    status: 'success' | 'error' | 'warning';
    event: 'LOGIN' | 'LOGOUT' | 'ERROR' | string;
    data?: any;
    mes?: string;
}

/**
 * Normalize a payload into a ServerResponse object.
 *
 * @param payload - A JSON string representing a ServerResponse or an already-parsed object.
 * @returns The normalized `ServerResponse` when valid, or `null` if the payload is invalid or cannot be parsed.
 */
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

/**
 * Process a ServerResponse and produce a value or perform side effects based on its `event` and `status`.
 *
 * When `event` is 'RE_LOGIN' or 'LOGIN' and a `RE_LOGIN_CODE` is present, that code is stored in localStorage.
 *
 * @param response - The response object whose `event`, `status`, `data`, and `mes` determine the outcome.
 * @returns `"success"` when a REGISTER event confirms account creation; the `RE_LOGIN_CODE` string for successful LOGIN/RE_LOGIN events; the response `data` for GET_USER_LIST, GET_PEOPLE_CHAT_MES, SEND_CHAT, and CHECK_USER_EXIST events; `null` for any other or unsuccessful cases.
 */
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
        case 'SEND_CHAT':
            return data;
        case 'CHECK_USER_EXIST':
            return data;
        default:
            console.log('handleEvent'+mes)
            return null;
    }
}