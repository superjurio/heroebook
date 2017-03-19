import {Injectable} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Book} from "../model/book";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {HttpUtils} from "../../common/service/HttpUtils";
import {TrackBookDto} from "../model/trackBookDto";


@Injectable()
export class BookService{

    private bookUrl = '/api/book';
    private trackingVisitBookUrl = 'localhost/visit-book';

    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) { }

    trackVisitBook(book : Book) : void{
        console.log("trackVisitBook : "+JSON.stringify(book.id));

        const trackBook : TrackBookDto = new TrackBookDto(book.authorId,book.id);

        this.http.post(this.trackingVisitBookUrl, JSON.stringify(trackBook), {headers: this.headers}).yyo
    }

    create(book: Book): Promise<ServiceStatusResponse> {
        console.log("create book : "+JSON.stringify(book));

        return new Promise<ServiceStatusResponse>((resolve, reject) => {

            let xhr:XMLHttpRequest = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("success from add book");
                        resolve(ServiceStatusResponse.CREATED);
                    } else {
                        console.log("error from add book : "+JSON.stringify(xhr.response));
                        console.log("status de base xhr : "+xhr.status);
                        console.log("status resp : "+ HttpUtils.find(xhr.status));
                        return reject(HttpUtils.find(xhr.status));
                     }
                }
            };

            let formData: FormData = new FormData();
            formData.append("coverPicFile", book.fileCoverPic, book.fileCoverPic.name);
            formData.append("title", book.title);
            formData.append("description", book.description);

            xhr.open('POST', this.bookUrl, true);
            xhr.send(formData);
            //
            // return this.http
            //     .post(this.bookUrl, JSON.stringify(book), {headers: this.headers})
            //     .toPromise()
            //     .then(res => {
            //         console.log("succes from add book");
            //         resolve(ServiceStatusResponse.CREATED);
            //     })
            //     .catch((errorResp : Response) => {
            //         console.log(" error from add book : "+JSON.stringify(errorResp));
            //         alert(HttpUtils.find(errorResp.status));
            //         console.log("status resp : "+ HttpUtils.find(errorResp.status));
            //         return reject(HttpUtils.find(errorResp.status));
            //     });
        });
    }

    getAll(): Promise<Book[]> {

        console.log("find all book");

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
                    console.log("error from getAll book : "+JSON.stringify(errorResp));
                    alert(HttpUtils.find(errorResp.status));
                    console.log("status resp : "+ HttpUtils.find(errorResp.status));
                    reject(HttpUtils.find(errorResp.status));
                });
        });
    }


}