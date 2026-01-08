type SocketEventHandler = (event: { type: string, payload: any }) => void;

export class SocketConnection {
    private socket: WebSocket | null = null;
    private readonly url: string;
    private reconnectInterval: ReturnType<typeof setInterval> | null = null;
    // private heartbeatInterval: ReturnType<typeof setInterval> | null = null;
    private readonly onEvent: SocketEventHandler;

    // Cấu hình
    private readonly RECONNECT_DELAY = 5000; // 5 giây thử lại 1 lần
    // private readonly HEARTBEAT_DELAY = 30000; // 30 giây gửi ping 1 lần

    constructor(url: string, onEvent: SocketEventHandler) {
        this.url = url;
        this.onEvent = onEvent;
    }

    public connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            if (this.socket.readyState === WebSocket.OPEN) {
                this.onEvent({ type: 'STATUS_CHANGE', payload: 'CONNECTED' })
            }
            return;
        }

        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket Connected");
            this.onEvent({ type: 'STATUS_CHANGE', payload: 'CONNECTED' });
            this.stopReconnect();
        };

        this.socket.onmessage = (msg: MessageEvent) => {
            this.onEvent({ type: 'RAW_MESSAGE', payload: msg.data });
        }

        this.socket.onclose = () => {
            console.log("WebSocket Disconnected");
            this.socket = null;
            // this.stopHeartbeat();
            this.onEvent({ type: 'STATUS_CHANGE', payload: 'DISCONNECTED' });
            this.autoReconnect();
        }

        this.socket.onerror = (error: Event) => {
            console.error("WebSocket Error", error);
            this.onEvent({ type: 'STATUS_CHANGE', payload: 'ERROR' });
        }
    }

    public send(data: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log(`Sending: ${data}`);
            this.socket.send(data);
        } else {
            console.warn("Socket not ready to send message");
        }
    }

    public disconnect(): void {
        this.stopReconnect();

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    private autoReconnect(): void {
        if (!this.reconnectInterval) {
            this.reconnectInterval = setInterval(() => {
                console.log("Reconnecting...");
                this.connect();
            }, this.RECONNECT_DELAY);
        }
    }

    private stopReconnect(): void {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }
}