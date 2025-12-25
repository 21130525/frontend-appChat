type SocketEventHandler = (event: { type: string, payload: any }) => void;

export class SocketConnection {
    private socket: WebSocket | null = null;
    private readonly url: string;
    private reconnectInterval: ReturnType<typeof setInterval> | null = null;
    private readonly onEvent: SocketEventHandler;

    constructor(url: string, onEvent: SocketEventHandler) {
        this.url = url;
        this.onEvent = onEvent;
    }

    public connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log(`[Connection] Connecting to ${this.url}...`);
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket Connected");
            this.onEvent({ type: 'STATUS_CHANGE', payload: 'CONNECTED' });
            this.stopReconnect();
        };

        this.socket.onmessage = (msg: MessageEvent) => {
            console.log("WebSocket Message received");
            this.onEvent({ type: 'RAW_MESSAGE', payload: msg.data });
        }

        this.socket.onclose = () => {
            console.log("WebSocket Disconnected");
            this.socket = null;
            this.onEvent({ type: 'STATUS_CHANGE', payload: 'DISCONNECTED' });
            // Tự động kết nối lại khi bị ngắt
            this.autoReconnect();
        }

        this.socket.onerror = (error: Event) => {
            console.error("WebSocket Error", error);
            this.onEvent({ type: 'STATUS_CHANGE', payload: 'ERROR' });
        }
    }

    public send(data: string): void {
        console.log(`[Connection] Sending to ${data}`);
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            console.warn("Socket not ready to send message");
        }
    }

    public disconnect(): void {
        // Chủ động ngắt kết nối thì phải dừng luôn việc auto reconnect
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
            }, 3000);
        }
    }

    private stopReconnect(): void {
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }
}