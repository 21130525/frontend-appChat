import webSocketService from "./WebSocketService.ts";

export default function  InitWebSocket() {
    webSocketService.connect();
}