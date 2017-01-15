import {Router} from "~express/lib/express";
import {ControllerDecorator} from "../../../decorator/ControllerDecorator";
import {Book} from "../../../../src/app/book/model/book";
import {Controller} from "../../../common/Controller";
import * as express from 'express';
import {info} from "winston";
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../common/repository/ServiceStatusResponse";
import {Server} from "../../../server";
import {InputCtrl} from "../../../common/InputCtrl";
import {UserAccountServiceImpl} from "./UserAccountServiceImpl";
import {UserAccountResp} from "./UserAccountResp";
import {AuthentUtils} from "../../../common/authent/passport/AuthentUtils";
import {UserAccountService} from "./UserAccountService";
import TYPES_INV from "../../../common/aop/aop-definition";
import container from "../../../common/aop/inversify.config";


@ControllerDecorator()
export class UserAccountController implements Controller{

    private userAccountService : UserAccountService =  container.get<UserAccountService>(TYPES_INV.UserAccountService);

    createRouter(inputCtrl : InputCtrl): Router {

        return express.Router().

        post('/user', (req, res, next)=> {
            this.userAccountService.subscribe(req.body.username,req.body.password)
                .then((resp:UserAccountResp) => {
                    info("results success from add user : "+JSON.stringify(req.user));
                    AuthentUtils.login(req, resp, res);
                })
                .catch((resp:UserAccountResp) => {
                    info("results error from add user : "+JSON.stringify(resp.getServiceResponse().msg));
                    if(resp.getServiceResponse().status == ServiceStatusResponse.RESOURCE_ALREADY_EXISTS){
                        res.status(409).send({error: resp.getServiceResponse().msg});
                    }else if(resp.getServiceResponse().status == ServiceStatusResponse.TECHNICAL_ERROR){
                        res.status(500).send({error : resp.getServiceResponse().msg});
                    }
            });
    }).
        post('/user/login',AuthentUtils.checkUserIsLogged, (req, res, next)=> {
            this.userAccountService.authenticate(req.body.username,req.body.password)
                .then((resp:UserAccountResp) => {
                    info("results success from login user : "+JSON.stringify(req.user));
                    AuthentUtils.login(req, resp, res);
                })
                .catch((resp:UserAccountResp) => {
                info("results error from login user : "+JSON.stringify(resp));
                if(resp.getServiceResponse().status == ServiceStatusResponse.UNAUTHORIZED){
                    res.status(401).send({error: resp.getServiceResponse().msg});
                }else if(resp.getServiceResponse().status == ServiceStatusResponse.TECHNICAL_ERROR){
                    res.status(500).send({error : resp.getServiceResponse().msg});
                }
            });
       }).

        get('/user/logout',(req,res)=>{
             info("logout step start");
             req.logout();
             req.session.destroy();
             info("logout step end");
             res.sendStatus(200);
        });

    }





}