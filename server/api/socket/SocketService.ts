
import {info} from "winston";
import {BookVisited} from "../event/BookVisited";
import Socket = SocketIOClient.Socket;
import {Server} from "http";
import socketIo = require('socket.io');
import {ConnectedUser} from "./ConnectedUser";
import _ = require("lodash");
import {ContextMessage} from "../event/ContextMessage";

export class SocketService{

    private static _instance:SocketService = new SocketService();
    public static connectedUser : ConnectedUser[] = [];

    constructor() {
    }


    public init(server : Server, middlewareAuthent,functionCallBackSocket : (socket : Socket)=>void){

        var socketIoServer : SocketIO.Server = socketIo(server);

        socketIoServer.use(middlewareAuthent);
        socketIoServer.on('connection', (socket : Socket) =>  {
           SocketService.displayUsers()

            if(!SocketService.isCurrentSocketUserIdExisting(socket)) {

                info('NOUVEL user ID de la socket ',(<any>socket).request.user.id);

                functionCallBackSocket(socket);

                socket.on('event1', function(eventData) {

                    if(!SocketService.isCurrentSocketUserIdExisting(socket)){
                        info("ExISTE PAS!!!!");
                        SocketService.connectedUser.push(new ConnectedUser(socket,socket.id,(<any>socket).request.user.username,(<any>socket).request.user.id))
                    }else{
                        info("ExISTE!!!!");
                        SocketService.getUser((<any>socket).request.user.id).logged = true;
                    }
                    info("nb users ",SocketService.connectedUser.length)
                    SocketService.displayUsers();
                });

                socket.on('disconnect', function () {

                    info('disconnect ',socket.id, "et userId : ",(<any>socket).request.user)
                    SocketService.getUser((<any>socket).request.user.id).logged = false;

                    setTimeout(function () {
                        if (!SocketService.getUser((<any>socket).request.user.id).logged){
                            info('SUPPRESSION DE ',(<any>socket).request.userId);
                            SocketService.connectedUser = _.remove(SocketService.connectedUser, (user : ConnectedUser) => {
                                user.userId == (<any>socket).request.user.id;
                            })
                        }else{
                            info('USER EST RELOGGE ',(<any>socket).request.user.id)
                        }
                    }, 10000);
                });
            }else{
                info('ANCIEN user ID de la socket ',(<any>socket).request.user.id);
                SocketService.getUser((<any>socket).request.user.id).logged = true;
            }
         });
    }

    static displayUsers(){
        info("LISTING USERS : ")
        SocketService.connectedUser.forEach((user) =>{
            info("userId : ",user.userId," et name : ",user.name," et socketId : ",user.socketId)
        })
    }

    public static isCurrentSocketUserIdExisting(socket: SocketIOClient.Socket) {
        SocketService.displayUsers();
        info(" et userId from soc : ",(<any>socket).request.user.id);
        const ok = _.find(SocketService.connectedUser, {userId:(<any>socket).request.user.id});
        if(ok){
            info("TROUVE : ",ok.userId);
        }else{
            info("NON TROUVE : ");
        }
        return ok;
    }

    public static getUser(userId : String) {
        SocketService.displayUsers();

        info("recherche a partir de userId : ",userId)
        const user : ConnectedUser = _.find(SocketService.connectedUser, {userId:userId});
        if(user){
            info("TROUVE : ",user.userId);
        }else{
            info("NON TROUVE : ");
        }
        return user;
    }


    public static getInstance():SocketService {
        return SocketService._instance;
    }

    public notifyBookVisitedToAuthor(contextMessage : ContextMessage, bookVisited : BookVisited){
        SocketService.displayUsers();

        info("authorId to notify : ",bookVisited.authorId)
        const user : ConnectedUser = SocketService.getUser(bookVisited.authorId);
        if(user && user.socketId == contextMessage.getSocket().id){
            info("user notifable trouve avec socketId ",user.getSocket().id);
            // user.getSocket().emit('message', { content: "heoooooooooooooo notifié!! "+bookVisited.bookId });
            contextMessage.getSocket().emit('message', { content: "heoooooooooooooo notifié!! "+bookVisited.bookId });
        }else{
            info("user non notifiable car non present : ",bookVisited.authorId)
        }

     }
}
