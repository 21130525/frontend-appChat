import {SocketConnection} from "./webSocket/SocketConnection.ts";

class WebSocketService {
    private static instance: WebSocketService;
    private connection: SocketConnection;

    private readonly url: string = "wss://chat.longapp.site/chat/chat";

    private subscribers: ((data: any) => void)[] = [];

    // singuton
    private constructor() {
        this.connection = new SocketConnection(this.url, (event) => this.handleConnectionEvent(event));
    }

    public static getInstance(): WebSocketService {
        if (!WebSocketService.instance) {
            WebSocketService.instance = new WebSocketService();
        }
        return WebSocketService.instance;
    }

    private handleConnectionEvent(event: { type: string; payload: any }) {
        switch (event.type) {
            case 'RAW_MESSAGE':
                try {
                    this.notify({type: 'RECEIVE_MESSAGE', payload: event.payload})
                }catch (e){
                    console.error("Lỗi phân tích dữ liệu JSON từ WebSocket:", e);
                    this.notify({ type: 'PARSE_ERROR', payload: event.payload });
                }
                break;
            case 'STATUS_CHANGE':
                this.notify({ type: 'STATUS_CHANGE', payload: event.payload });
                break;
            default:
                this.notify(event);
        }
    }

    // Subscriber Pattern
    public subscribe(callback: (data: any) => void): () => void {
        this.subscribers.push(callback)
        return  () => {
            this.subscribers = this.subscribers.filter((sub) => sub !== callback)
        };
    }
    private notify(event: any){
        this.subscribers.forEach((callback) => callback(event));
    }

    public connect() {
        this.connection.connect();
    }

    public disconnect() {
        this.connection.disconnect();
    }

    public sendMessage(message: string) {
        this.connection.send(message);
    }
    
    
}  
export default WebSocketService.getInstance();
