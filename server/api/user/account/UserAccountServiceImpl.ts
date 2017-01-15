
import {error, info} from "winston";
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../common/repository/ServiceStatusResponse";
import {User} from "../../../../src/app/user/model/user";
import {UserAccountService} from "./UserAccountService";
import _ = require("lodash");
import {UserAccountResp} from "./UserAccountResp";
import {UserAccountRepository} from "./UserAccountRepository";
import container from "../../../common/aop/inversify.config";
import {injectable} from "inversify";
import TYPES_INV from "../../../common/aop/aop-definition";

const bCrypt = require('bCrypt-nodejs');

@injectable()
export class UserAccountServiceImpl implements UserAccountService {


    private userAccountRepository : UserAccountRepository =  container.get<UserAccountRepository>(TYPES_INV.UserAccountRepository);

    subscribe(username: String, password: String): Promise<UserAccountResp> {

        if(_.isEmpty(username) ||_.isEmpty(password)){
            throw new Error("Error: username and password should be not null");
        }

        return new Promise<UserAccountResp>((resolve, reject) => {

            this.userAccountRepository.find(username)
            .then((res : User) => {
                info("results success from find user : "+res);
                if(res){
                    reject(UserAccountResp.createFailResponse(new ServiceResponse(ServiceStatusResponse.RESOURCE_ALREADY_EXISTS,"The username  : "+username+" already exists")));
                }else {
                    let user : User = new User(username,bCrypt.hashSync(password, bCrypt.genSaltSync(10), null));
                    this.userAccountRepository.add(user)
                        .then((res : ServiceResponse) => {
                            info("results success from add user : "+JSON.stringify(res));
                           resolve(UserAccountResp.createSuccessResponse(new ServiceResponse(ServiceStatusResponse.CREATED),user));
                        })
                        .catch((res : ServiceResponse) => {
                            info("results error from add user : "+JSON.stringify(res));
                            reject(UserAccountResp.createFailResponse(res));
                        })
                }
            })
            .catch((res : string) => {
                info("results error from find user : "+JSON.stringify(res));
                reject(UserAccountResp.createFailResponse(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,res)));
            });
     })
    };


    authenticate(username: String, password: String): Promise<UserAccountResp> {
        if(_.isEmpty(username) ||_.isEmpty(password)){
            throw new Error("Error: username and password should be not null");
        }
        return new Promise<UserAccountResp>((resolve, reject) => {

            this.userAccountRepository.find(username)
                .then((res : User) => {
                    info("results success from find user : "+JSON.stringify(res));
                    if(res && bCrypt.compareSync(password, res.password)){
                        info("password OK");
                        resolve(UserAccountResp.createSuccessResponse(new ServiceResponse(ServiceStatusResponse.CREATED),res));
                    }else {
                        info("problem to authenticate");
                        reject(UserAccountResp.createFailResponse(new ServiceResponse(ServiceStatusResponse.UNAUTHORIZED,"The login is not authorized")));
                    }
                })
                .catch((res : string) => {
                    info("results error from login user : "+JSON.stringify(res));
                    reject(UserAccountResp.createFailResponse(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,res)));
                });
        })    }
}