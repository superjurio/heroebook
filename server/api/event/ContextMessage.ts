import Socket = SocketIOClient.Socket;

export class ContextMessage{

    private userId : String;
    private socket : Socket;

    getUserId() : String {
        return this.userId;
    }

    getSocket() : Socket {
        return this.socket;
    }

    setUserId(userId : String){
        this.userId = userId;
    }

    setSocket(socket : Socket){
        this.socket = socket;
    }
}