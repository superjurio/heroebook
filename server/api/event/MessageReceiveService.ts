
import Socket = SocketIOClient.Socket;
import {ContextMessage} from "./ContextMessage";

export interface MessageReceiveService {

    initialize(contextMessage : ContextMessage) : void;

}
