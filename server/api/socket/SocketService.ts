
import {info} from "winston";
import {BookVisited} from "../event/BookVisited";
import Socket = SocketIOClient.Socket;
import {Server} from "http";
import socketIo = require('socket.io');

export class SocketService{

    private static _instance:SocketService = new SocketService();

    constructor() {
    }

    create(server : Server,functionCallBackSocket : (socket : Socket)=>void){
        var socketIoServer : SocketIO.Server = socketIo(server);
        socketIoServer.on('connection', (socket : Socket) =>  functionCallBackSocket(socket));
     }

    public static getInstance():SocketService {
        return SocketService._instance;
    }

    public notifyBookVisitedToAuthor(socket, bookVisited : BookVisited){
        socket.emit('message', { content: bookVisited.bookId });
    }
}
