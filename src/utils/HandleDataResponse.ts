interface ServerResponse {
    status: 'success' | 'error' | 'warning';
    event: 'LOGIN' | 'LOGOUT' | 'ERROR' | string; // Mở rộng với các event khác
    data: any;
}

type EventHandler = (data: any) => any;

const eventHandlers: Record<string, EventHandler> = {
    LOGIN: (data: { RE_LOGIN_CODE?: string }): string | null => {
        console.log("-> Đang xử lý đăng nhập...");
        if (data && data.RE_LOGIN_CODE) {
            localStorage.setItem('reLoginCode', data.RE_LOGIN_CODE);
            return data.RE_LOGIN_CODE;
        }
        return null;
    },

    LOGOUT: (): boolean => {
        localStorage.clear();
        return true;
    },

    ERROR: (data: { message?: string }): boolean => {
        console.error("-> Có lỗi từ server:", data?.message || 'Unknown error');
        return false;
    }
    // thêm case mới
    // ...
};

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
        const { status, event, data } = response;

        // 2. Logic điều hướng
        // Ưu tiên check event ERROR trước, bất kể status là gì (đôi khi server trả success nhưng nội dung lại báo lỗi logic)
        if (event === 'ERROR' && eventHandlers.ERROR) {
            return eventHandlers.ERROR(data);
        }

        if (status !== 'success') {
            console.warn(`Server status: ${status}`);
            return null;
        }

        // 3. Tìm và chạy handler
        const handler = eventHandlers[event];
        if (handler) {
            return handler(data);
        } else {
            console.warn(`Bỏ qua: Sự kiện '${event}' chưa được hỗ trợ.`);
            return null;
        }

    } catch (error) {
        console.error("System Error:", error);
        return null;
    }
}

// --- TEST THỬ ---
const jsonInput = '{"status":"success","data":{"RE_LOGIN_CODE":"nlu_1359710970"},"event":"LOGIN"}';
const result = handleServerResponse(jsonInput);
console.log("Kết quả trả về:", result);
