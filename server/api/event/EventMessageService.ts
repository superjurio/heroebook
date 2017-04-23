import {BookVisited} from "./BookVisited";

import {info} from "winston";
import {SocketService} from "../socket/SocketService";
import Socket = SocketIOClient.Socket;
import {ContextMessage} from "./ContextMessage";

export class EventMessageService {

    private static _instance:EventMessageService = new EventMessageService();

    constructor() {
        if(EventMessageService._instance){
            throw new Error("Error: Instantiation failed. Singleton module! Use .getInstance() instead of new.");
        }
        EventMessageService._instance = this;
    } 

    public static getInstance():EventMessageService {
        return EventMessageService._instance;
    }

    public handleBookVisited(contextMessage : ContextMessage, bookVisited : BookVisited) : void {
        info("handle book visited : ",bookVisited);
        SocketService.getInstance().notifyBookVisitedToAuthor(contextMessage,bookVisited);
    }
}
