
import * as bodyParser from "body-parser";
import * as express from 'express';
var morgan = require('morgan');
var multer = require('multer');
var http = require('http');

var compression = require('compression');
const passport = require('passport');
const bCrypt = require('bCrypt-nodejs');

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
import socketIo = require('socket.io');
import {Server} from "http";

export class MainServer {

    private app : express.Application;

    constructor() {
        var storage = multer.memoryStorage();

         var upload = multer({storage:storage});

        this.app = express();
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
        var server = require('http').Server(this.app);
        var io = require('socket.io')(server);

        server.listen(6080);

        io.on('connection', (socket) =>{
            info("user connected");
            socket.emit('message', { content: 'world' });

        });

    }

    private initMiddlewareSession() {
        // this.app.use(session({ secret: 'anything' }));
        this.app.use(session({
            store: new RedisStore({
                url: ConfigManager.getCurrentConfig().getConfigRedisAddress()
            }),
            secret: "anything"
            // resave: false,
            // saveUninitialized: false
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











