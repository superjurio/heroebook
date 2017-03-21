import {Injectable} from '@angular/core';
import 'rxjs/add/operator/toPromise';
import {Observable} from "rxjs";
import * as io from 'socket.io-client';


@Injectable()
export class NotificationBookService{


    private url = 'http://localhost:5000';
    private socket;

    sendMessage(message){
        this.socket.emit('add-message', message);
    }

    getMessages() {
        let observable = new Observable(observer => {
            this.socket = io(this.url);
            this.socket.on('message', (data) => {
                observer.next(data);
            });
            return () => {
                this.socket.disconnect();
            };
        })
        return observable;
    }

}