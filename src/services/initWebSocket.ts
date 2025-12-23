import WebSocketService from "./WebSocketService.ts";

export const initWebSocket = () => {
    WebSocketService.connect();
};