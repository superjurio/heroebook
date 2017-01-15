import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {HttpUtils} from "../../common/service/HttpUtils";
import {User} from "../model/user";


@Injectable()
export class UserService{

    private userUrl = '/api/user';
    private userLoginUrl = '/api/user/login';
    private userLogoutUrl = '/api/user/logout';

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    create(user: User): Promise<ServiceStatusResponse> {
        console.log("create user : "+JSON.stringify(user));

        return new Promise<ServiceStatusResponse>((resolve, reject) => {

            return this.http
                .post(this.userUrl, JSON.stringify(user), {headers: this.headers})
                .toPromise()
                .then(res => {
                    console.log("success from add user");
                    resolve(ServiceStatusResponse.CREATED);
                })
                .catch((errorResp : Response) => {
                    console.log(" error from add user : "+JSON.stringify(errorResp));
                    alert(HttpUtils.find(errorResp.status));
                    console.log("status resp : "+ HttpUtils.find(errorResp.status));
                    return reject(HttpUtils.find(errorResp.status));
                });
        });
    }

    authenticate(user: User): Promise<ServiceStatusResponse> {
        console.log("authenticate user : "+JSON.stringify(user));

        return new Promise<ServiceStatusResponse>((resolve, reject) => {

            return this.http
                .post(this.userLoginUrl, JSON.stringify(user), {headers: this.headers})
                .toPromise()
                .then(res => {
                    console.log("success from authenticate user");
                    resolve(ServiceStatusResponse.CREATED);
                })
                .catch((errorResp : Response) => {
                    console.log(" error from authenticate user : "+JSON.stringify(errorResp));
                    console.log("status resp : "+ HttpUtils.find(errorResp.status));
                    return reject(HttpUtils.find(errorResp.status));
                });
        });
    }

    logout(): Promise<ServiceStatusResponse>{
        return new Promise<ServiceStatusResponse>((resolve, reject) => {

            return this.http
                .get(this.userLogoutUrl, {headers: this.headers})
                .toPromise()
                .then(res => {
                    console.log("success from logout user");
                    resolve(ServiceStatusResponse.CREATED);
                })
                .catch((errorResp : Response) => {
                    console.log(" error from logout user : "+JSON.stringify(errorResp));
                    console.log("status resp : "+ HttpUtils.find(errorResp.status));
                    return reject(HttpUtils.find(errorResp.status));
                });
        });
    }

}