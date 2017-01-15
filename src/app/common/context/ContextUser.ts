
import {StorageService} from "../storage/StorageService";
import {Injectable} from "@angular/core";


export class ContextUser{


    private logged : boolean = false;


    public setLogged(val : boolean){
        this.logged = val;
    }

    public isLogged() : boolean{
        return this.logged;
    }

}