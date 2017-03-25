import {Component, OnDestroy} from '@angular/core';
import {OnInit} from '@angular/core';
import {NotificationBookService} from "../book/service/notification.book.service";

@Component({
    selector: 'notification',
    providers: [NotificationBookService],
    templateUrl: 'app/notification/notification.component.html',
    styleUrls: ['app/notification/notification.component.css']
})


export class NotificationComponent implements OnInit,OnDestroy {

    connection;
    messages = [];


    constructor(private notificationService: NotificationBookService) {

    }


    ngOnInit(): void {
        this.connection = this.notificationService.getMessages().subscribe(message => {
            this.messages.push(message);
        })
    }

    ngOnDestroy() {
        this.connection.unsubscribe();
    }

}