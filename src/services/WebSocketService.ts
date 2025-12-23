import {SocketConnection} from "./webSocket/SocketConnection.ts";

class WebSocketService {
    private static instance: WebSocketService;
    private connection: SocketConnection;
    private readonly url: string = "wss://chat.longapp.site/chat/chat";
    private subcribers: ((data: any) => void)[] = [];
    
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
                    const data = JSON.parse(event.payload);
                    this.notify({type: 'RECEIVE_MESSAGE', payload: data})
                }catch (e){
                    console.error("Error parsing message:", e);
                    this.notify({ type: 'RECEIVE_MESSAGE', payload: event.payload }); 
                }
                break;
            default:
                this.notify(event);
        }
    }
    public subcribe(callback: (data: any) => void): () => void {
        this.subcribers.push(callback)
        return  () => {
            this.subcribers = this.subcribers.filter((sub) => sub !== callback)
        };
    }
    private notify(event: any){
        this.subcribers.forEach((callback) => callback(event));
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
