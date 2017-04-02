import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";

import * as io from 'socket.io-client';

@Injectable()
export class NotificationBookService{

    private url = 'http://localhost:6080';
    private socket : SocketIOClient.Socket  ;


    getMessages() {

        let observable = new Observable(observer => {

            this.socket = io(this.url);
            this.socket.emit('event1', "hello");

            this.socket.on('message', (data) => {
                console.log("message from server  :",data)
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

}