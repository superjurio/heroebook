import {EventMessageService} from "./EventMessageService";
var kafka = require('kafka-node');

import {info} from "winston";
import {BookVisited} from "./BookVisited";
import {ValueUtils} from "../../common/ValueUtils";
import Socket = SocketIOClient.Socket;
import {MessageReceiveService} from "./MessageReceiveService";
import {injectable} from "inversify";
import {ContextMessage} from "./ContextMessage";

@injectable()
export class MessageReceiveServiceImpl implements  MessageReceiveService{

    initialize(contextMessage : ContextMessage) : void{
        this.handleActions(this.create(),contextMessage);
    }

    private handleActions(consumer,contextMessage){
        consumer.on('message', function (message) {
            info("consumer kafka receive this message  : ",message);

            if(ValueUtils.isJSON(message.value)) {
                let jsonObject =  JSON.parse(message.value);
                info("consumer kafka receive this Valid message value to handle : ",jsonObject);
                EventMessageService.getInstance().handleBookVisited(contextMessage, new BookVisited(jsonObject.authorId, jsonObject.bookId))
            }else{
                info("Wrong type of message to consume");
            }
        });
        consumer.on('error', function (message) {
            info("errrrrrrrrrrrrrrrr: ",message);
        });
    }


    private create(){
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
