import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Book} from "../model/book";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {HttpUtils} from "../../common/service/HttpUtils";
import {ContextUserService} from "../../common/context/ContextUserService";


@Injectable()
export class MyWrittenBookService{

    private bookUrl = '/api/my-written-books';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http, private contextService : ContextUserService) { }



    findMyBooks(): Promise<Book[]> {

        console.log("find my books");

        return new Promise<Book[]>((resolve, reject) => {

            this.http
                .get(this.bookUrl, {headers: this.headers})
                .map(response => response.json())
                .toPromise().then((res : any) => {
                    for(let entry of res){
                        if(entry.fileCoverPic != null){
                            entry.fileCoverPic = new Buffer(entry.fileCoverPic).toString('base64');
                        }
                     }
                    return resolve(res);
                })
                .catch((errorResp : Response) => {
                    console.log("error from findMyBooks book : "+JSON.stringify(errorResp));
                    console.log("status resp : "+ HttpUtils.find(errorResp.status));
                    reject(HttpUtils.find(errorResp.status));
                });
        });
    }


}