
import * as bodyParser from "body-parser";
import * as express from 'express';
var morgan = require('morgan');
var multer = require('multer');
var http = require('http');

var passportSocketIo = require("passport.socketio");
var cookieParser = require('cookie-parser')

var compression = require('compression');
const passport = require('passport');

const session = require('express-session');
const RedisStore = require('connect-redis')(session);
import Path = require("path");
import "reflect-metadata";
import {RoutingExpressInjection} from "./RoutingInjection";
import {Request} from "~express/lib/request";
import {Response} from "~express/lib/response";
import {NextFunction} from "~express/lib/router/index";
import {error, info} from "winston";
import {ConfigManager} from "./config/ConfigManager";
import {SocketService} from "./api/socket/SocketService";
import {MessageReceiveService} from "./api/event/MessageReceiveService";
import Socket = SocketIOClient.Socket;
import container from "./common/aop/inversify.config";
import TYPES_INV from "./common/aop/aop-definition";
import {ContextMessage} from "./api/event/ContextMessage";
import socketIo = require('socket.io');

export class MainServer {

    private app : express.Application;

    private redisSessionStore;

    private messageReceiveService : MessageReceiveService =  container.get<MessageReceiveService>(TYPES_INV.MessageReceiveService);

    constructor() {
        var storage = multer.memoryStorage();
        var upload = multer({storage:storage});

        this.app = express();
        this.app.use(cookieParser());
        this.app.use(bodyParser.urlencoded({extended:true}));
        this.app.use(bodyParser.json());
        this.app.use(morgan('short'));
        this.app.use(compression());
        this.initMiddlewareSession();
        this.initMiddlewareAuthent();
        RoutingExpressInjection.getInstance().init(Path.resolve(__dirname)+"/api/**/**Controller.js",this.app,upload,passport);

        //manage crash app
        process.on('uncaughtException', function(ex) {
            error("uncaughtException "+ex);
         });

        this.app.use(this.errorHandler);

        var server = http.Server(this.app);
        server.listen(6080);

        SocketService.getInstance().init(server,this.createPassportSocketIoConfig(),(socketValue : Socket) => {
            let socket  : Socket = socketValue;
            info("Socket generated ", socket.id);
            const contextMessage : ContextMessage = new ContextMessage();
            contextMessage.setSocket(socket);
            this.messageReceiveService.initialize(contextMessage);
        });
    }

    private createPassportSocketIoConfig() {
        return passportSocketIo.authorize({
            cookieParser: cookieParser,       // the same middleware you registrer in express
            key: 'test',       // the name of the cookie where express/connect stores its session_id
            secret: 'anything',    // the session_secret to parse the cookie
            store: this.redisSessionStore,        // we NEED to use a sessionstore. no memorystore please
        });
    }


    private initMiddlewareSession() {
        // this.app.use(session({ secret: 'anything' }));
        this.redisSessionStore = new RedisStore({
            url: ConfigManager.getCurrentConfig().getConfigRedisAddress()});

        this.app.use(session({
            key : 'test',
            store: this.redisSessionStore,
            secret: "anything",
            resave: false,
            saveUninitialized: false
        }))
    }

    private initMiddlewareAuthent() {
        this.app.use(passport.initialize());
        this.app.use(passport.session());

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
    }

    private errorHandler(error: any, request: Request, response: Response, next: NextFunction): any {
        if (response.headersSent) {
            return next(error);
        }
        response.status(error.status || 500).send("Internal Error");
        next(error);
    }
}
var server = new MainServer();











