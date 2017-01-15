import {Injectable} from '@angular/core';
import {Headers, Http, Response, URLSearchParams} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {Book} from "../model/book";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {HttpUtils} from "../../common/service/HttpUtils";
import {ContextUserService} from "../../common/context/ContextUserService";
import {BookPage} from "../book-edit-pages/bookPage";


@Injectable()
export class BookEditPagesService{

    private bookUrl = '/api/book-edit-pages';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http, private contextService : ContextUserService) { }


    findPagesByBookId(bookId : string): Promise<BookPage[]> {

        console.log("find pages of  book ",bookId);
        let params: URLSearchParams = new URLSearchParams();
        params.set('bookId', bookId);

        return new Promise<BookPage[]>((resolve, reject) => {

            this.http
                .get(this.bookUrl,{search : params})
                .map(response => response.json())
                .toPromise().then((res : any) => {
                    return resolve(res);
                })
                .catch((errorResp : Response) => {
                    console.log("error from pages book : "+JSON.stringify(errorResp));
                    alert(HttpUtils.find(errorResp.status));
                    console.log("status resp : "+ HttpUtils.find(errorResp.status));
                    reject(HttpUtils.find(errorResp.status));
                });
        });
    }

    create(bookPage: BookPage): Promise<ServiceStatusResponse> {
        console.log("create bookPage : "+JSON.stringify(bookPage));

        return new Promise<ServiceStatusResponse>((resolve, reject) => {

            let xhr:XMLHttpRequest = new XMLHttpRequest();
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        console.log("success from add bookPage");
                        resolve(ServiceStatusResponse.CREATED);
                    } else {
                        console.log("error from add bookPage : "+JSON.stringify(xhr.response));
                        console.log("status de base xhr : "+xhr.status);
                        console.log("status resp : "+ HttpUtils.find(xhr.status));
                        return reject(HttpUtils.find(xhr.status));
                    }
                }
            };

            let formData: FormData = new FormData();
            formData.append("contentText", bookPage.contentText);
            formData.append("bookId", bookPage.bookId);
            formData.append("numPage", bookPage.numPage);
            formData.append("newPage", bookPage.newPage);

            xhr.open('POST', this.bookUrl, true);
            xhr.send(formData);
        });
    }
}