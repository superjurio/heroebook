
import {Injectable} from "@angular/core";
import {Http, ConnectionBackend, RequestOptions, RequestOptionsArgs, Response, Headers, Request} from "@angular/http";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {ContextUserService} from "../common/context/ContextUserService";
@Injectable()

export class CustomHttp extends Http {

    constructor(backend: ConnectionBackend, defaultOptions: RequestOptions, private _router: Router,private contextUserService : ContextUserService) {
        super(backend, defaultOptions);
    }

    request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.request(url, options));
    }

    get(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.get(url,options));
    }

    post(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.post(url, body, options));
    }

    put(url: string, body: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.put(url, body,options));
    }

    delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
        return this.intercept(super.delete(url, options));
    }


    intercept(observable: Observable<Response>): Observable<Response> {
        return observable.catch((err, source) => {
            console.log("Handle global error , status  :",err.status);
            if (err.status  == 500) {
                 console.log("ERREUR 500 TECHNICAL => REDIRECT "+this._router);
                 this._router.navigate(['/indispo']);
                return Observable.throw(err);
            } else if(err.status == 401){
                this.contextUserService.reset();
                this._router.navigate(['/unauthorized']);
                return Observable.throw(err);
            }
            else {
                return Observable.throw(err);
            }
        });

    }
}