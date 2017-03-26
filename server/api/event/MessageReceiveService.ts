import {EventMessageService} from "./EventMessageService";
var kafka = require('kafka-node');

import {info} from "winston";
import {BookVisited} from "./BookVisited";
import {ValueUtils} from "../../common/ValueUtils";
import Socket = SocketIOClient.Socket;

export class MessageReceiveService{

    private static _instance:MessageReceiveService = new MessageReceiveService();

    constructor() {
        if(MessageReceiveService._instance){
            throw new Error("Error: Instantiation failed. Singleton module! Use .getInstance() instead of new.");
        }
        MessageReceiveService._instance = this;
    }

    public static getInstance():MessageReceiveService {
        return MessageReceiveService._instance;
    }

    handleActions(consumer,socket : Socket){
        consumer.on('message', function (message) {
            info("consumer kafka receive this message  : ",message);

            if(ValueUtils.isJSON(message.value)) {
                let jsonObject =  JSON.parse(message.value);
                info("consumer kafka receive this Valid message value to handle : ",jsonObject);
                EventMessageService.getInstance().handleBookVisited(socket, new BookVisited(jsonObject.authorId, jsonObject.bookId))
            }else{
                info("Wrong type of message to consume");
            }
        });

        consumer.on('error', function (message) {
            info("errrrrrrrrrrrrrrrr: ",message);
        });
    }


    create(){
        var client = new kafka.Client();
        var Consumer  = kafka.Consumer;
        var consumer = new Consumer(
            client,
            [
                { topic: 'BOOK_VISITED', partition: 0 }
            ],
            {
                autoCommit: false,
                groupId: 'kafka-node-group'
            }
        );
        return consumer;
    }


}
