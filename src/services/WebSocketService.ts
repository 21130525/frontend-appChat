class WebSocketService {
    private static instance: WebSocketService;
    private socket: WebSocket | null = null;
    private readonly url: string = "wss://chat.longapp.site/chat/chat";
    private subscribers: ((data: any) => void)[] = [];
    private reconnectInterval: ReturnType<typeof setInterval> | null = null;

    private constructor() {}

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    public subscribe(callback: (data: any) => void): () => void {
        this.subscribers.push(callback);
        return () => {
            this.subscribers = this.subscribers.filter((sub) => sub !== callback);
        };
    }

    private notify(event: any): void {
        this.subscribers.forEach((callback) => callback(event));
    }

    public connect(): void {
        if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
            return;
        }

        console.log(`Connecting to ${this.url}...`);
        this.socket = new WebSocket(this.url);

        this.socket.onopen = () => {
            console.log("WebSocket Connected");
            this.notify({ type: 'STATUS_CHANGE', payload: 'CONNECTED' });
            if (this.reconnectInterval) {
                clearInterval(this.reconnectInterval);
                this.reconnectInterval = null;
            }
        };

        this.socket.onmessage = (msg: MessageEvent) => {
            try {
                const data = JSON.parse(msg.data);
                this.notify({ type: 'RECEIVE_MESSAGE', payload: data });
            } catch (e) {
                console.error("Error parsing message:", e);
                // Fallback for non-JSON messages if needed
                this.notify({ type: 'RECEIVE_MESSAGE', payload: msg.data });
            }
        };

        this.socket.onclose = () => {
            console.log("WebSocket Disconnected");
            this.socket = null;
            this.notify({ type: 'STATUS_CHANGE', payload: 'DISCONNECTED' });
            this._autoReconnect();
        };

        this.socket.onerror = (error: Event) => {
            console.error("WebSocket Error:", error);
            this.notify({ type: 'STATUS_CHANGE', payload: 'ERROR' });
        };
    }

    public sendMessage(data: any): void {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        } else {
            console.warn("Socket not ready");
        }
    }

    public disconnect(): void {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        if (this.reconnectInterval) {
            clearInterval(this.reconnectInterval);
            this.reconnectInterval = null;
        }
    }

    private _autoReconnect(): void {
        if (!this.reconnectInterval) {
            this.reconnectInterval = setInterval(() => {
                console.log("Reconnecting...");
                this.connect();
            }, 3000);
        }
    }
}

export default WebSocketService.getInstance();
