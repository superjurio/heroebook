import {ServiceStatusResponse} from "./ServiceStatusResponse";
export class ServiceResponse{

    readonly msg : String;
    readonly status : ServiceStatusResponse;


    constructor(status: ServiceStatusResponse, msg?: String ) {
        this.msg = msg;
        this.status = status;
    }

}