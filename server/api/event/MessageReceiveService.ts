
import Socket = SocketIOClient.Socket;

export interface MessageReceiveService {

    initialize(socket : Socket) : void;

}
