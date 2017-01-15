
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {User} from "../../../../src/app/user/model/user";
export class UserAccountResp{

    private serviceResponse : ServiceResponse;
    private user : User;


    static createSuccessResponse(serviceResponse: ServiceResponse, user: User) : UserAccountResp {
        return new UserAccountResp(serviceResponse,user);
    }


    static createFailResponse(serviceResponse: ServiceResponse) : UserAccountResp{
        return new UserAccountResp(serviceResponse,null);
    }


    constructor(serviceResponse: ServiceResponse, user: User) {
        this.serviceResponse = serviceResponse;
        this.user = user;
    }


    public getServiceResponse() : ServiceResponse {
        return this.serviceResponse;
    }

    public getUser() : User {
        return this.user;
    }
}