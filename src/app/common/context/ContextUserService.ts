
import {StorageService} from "../storage/StorageService";
import {Injectable} from "@angular/core";
import {ContextUser} from "./ContextUser";
import _ = require("lodash");
@Injectable()
export class ContextUserService{


    constructor(private storageService : StorageService){
        if(this.storageService.read("contextUser") == null){
            this.store(new ContextUser());
        }
     }

    setLogged(val : boolean){
        let ct : ContextUser = this.getCurrentContextUser();
        ct.setLogged(val);
        this.store(ct);
    }

    getCurrentContextUser() : ContextUser{
        let recreatedCtx :ContextUser = new ContextUser();
        recreatedCtx = _.extend(recreatedCtx,this.storageService.read("contextUser") as ContextUser);
        return recreatedCtx;
    }

    store(ct : ContextUser){
        this.storageService.write("contextUser",ct);
    }

    reset(){
        this.storageService.write("contextUser",null);
    }
}