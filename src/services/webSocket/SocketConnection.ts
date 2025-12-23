type SocketEventHandler = (event: { type: string, payload: any }) => void;


export class SocketConnection {
    public socket: WebSocket | null = null;
    public url: string;
    private reconnectInterval: ReturnType<typeof setInterval> | null = null;
    private onEvent: SocketEventHandler;

    constructor(url: string, onEvent: SocketEventHandler) {
        this.url = url;
        this.onEvent = onEvent;
    }

    public connect() {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket Connected");
            this.onEvent({type: 'RAW_MESSAGE', payload: 'CONNECTED'})
        };

        this.socket.onmessage = (msg: MessageEvent) => {
            console.log("WebSocket Message", msg.data);
            this.onEvent({type: 'RAW_MESSAGE', payload: msg.data})
        }

        this.socket.onclose = () => {
            console.log("WebSocket Disconnected");
            this.socket = null;
            this.onEvent({type: 'STATUS_CHANGE', payload: 'DISCONNECTED'})
            this.autoReconnect();
        }

        this.socket.onerror = (error: Event) => {
            console.error("WebSocket Error", error);
            this.onEvent({type: 'STATUS_CHANGE', payload: 'ERROR'})
        }

    }

    public send(data: string): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(data);
        } else {
            console.warn("Socket not ready");
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null
        }
        this.stopReconnect();
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