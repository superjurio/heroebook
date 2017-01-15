 import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";

export class HttpUtils{

    static find(statusCode : number) : ServiceStatusResponse{
        switch(statusCode){
            case 401 :
                return ServiceStatusResponse.UNAUTHORIZED;
            case 409 :
                return ServiceStatusResponse.RESOURCE_ALREADY_EXISTS;
            case 500 :
                return ServiceStatusResponse.TECHNICAL_ERROR;
            default :
                return ServiceStatusResponse.TECHNICAL_ERROR;
        }
        // for(var enumV in HttpStatusResponseMapper){
        //     if(parseInt(enumV) == statusCode){
        //         return  HttpStatusResponseMapper[<string>enumV];
        //     }
        //     return null;
        // }
    }
}