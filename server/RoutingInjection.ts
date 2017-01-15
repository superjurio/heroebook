
import {info} from "winston";
import * as express from 'express';
import {Controller} from "./common/Controller";
import {InputCtrl} from "./common/InputCtrl";

export class RoutingExpressInjection{

    private static _instance:RoutingExpressInjection = new RoutingExpressInjection();

    private controllers : Controller[] = [];

    constructor() {
        if(RoutingExpressInjection._instance){
            throw new Error("Error: Instantiation failed. Singleton module! Use .getInstance() instead of new.");
        }
        RoutingExpressInjection._instance = this;
    } 

    public static getInstance():RoutingExpressInjection {
        return RoutingExpressInjection._instance;
    }
 
    public addController(targetClass:any):void{
        info("ctrl to add to injection " +targetClass.name);
        let ctrl : Controller = new targetClass();
        this.controllers.push(ctrl);
    }

    public init(pathControllers: string,app : express.Application,multer : any,passport : any) {

        let files: string[] = require('glob').sync(pathControllers);
        files.forEach((file : string)=>{
            info("current file to read : %s",file);
            require(file);
        });
        this.controllers.forEach((ctrl:Controller)=>{
            app.use('/api',ctrl.createRouter(new InputCtrl(multer,passport)));
        });
    }
}
