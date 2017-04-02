import Socket = SocketIOClient.Socket;
export class ConnectedUser{

    socket : Socket;
    socketId : String;
    name : String;
    userId : String;
    logged : boolean = false;

    constructor(socket : Socket,socketId: String, name: String, userId: String) {
        this.socket = socket;
        this.socketId = socketId;
        this.name = name;
        this.userId = userId;
    }


    getSocket() : Socket {
        return this.socket;
    }

    getSocketId(): String {
        return this.socketId;
    }

    getName(): String {
        return this.name;
    }

    getUserId(): String {
        return this.userId;
    }
}