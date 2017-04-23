
import {error, info} from "winston";
import * as _ from "lodash";
import {injectable} from "inversify";
import {EditBookPagesRepository} from "./EditBookPagesRepository";
import {BookPage} from "../../../../src/app/book/book-edit-pages/bookPage";
import {CassandraOperations} from "../../../cassandra/CassandraOperations";
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../common/repository/ServiceStatusResponse";
import {v4} from "node-uuid";

@injectable()
export class EditBookPagesCassandraRepository implements  EditBookPagesRepository{


    findPagesByBookId(bookId: String): Promise<BookPage[]> {
        return new Promise<BookPage[]>((resolve, reject) => {

            let bookPages : BookPage[] = Array<BookPage>();

            if(_.isEmpty(bookId)){
                reject('The bookId must not be null');
            }

            var query = 'SELECT * from book_page where book_id = ?';
            var params = [bookId];

            CassandraOperations.client.execute(query, params, { prepare: true }, function(err,result) {
                if (err){
                    error('Something when wrong'+JSON.stringify(err));
                    reject('Something when wrong'+JSON.stringify(err));
                }
                else {
                    if (result.rows.length > 0) {
                        for (var i = 0; i < result.rows.length; i++) {
                            const bookFound : any = result.rows[i];
                            info("current numPage from db : " + bookFound.num_page);
                            bookPages.push(new BookPage(bookFound.book_id,bookFound.num_page,bookFound.content_text,null));
                        }
                    }
                    resolve(bookPages);
                }
            });
        })
    }


    add(bookPage: BookPage): Promise<ServiceResponse> {
        info("ajoute page pour livre : "+bookPage.bookId+" et page text : "+bookPage.contentText);

        return new Promise<ServiceResponse>((resolve, reject) => {

            //FIXME ajout controle coherence valeur des champs selon type de page (image? text ? choix ?)
            if(bookPage == null){
                reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"The BookPage must not be null"));
            }

            //FIXME verifier que la page numéro n'existe pas déja OU remplacer ancienne par nouvelle ?!

            // info("Result found from exists bookPage : "+res);
            // if(res){
            //     reject(new ServiceResponse(ServiceStatusResponse.RESOURCE_ALREADY_EXISTS,"The book title  : "+book.title+" already exists"));
            // }else{
                var query = 'INSERT INTO book_page (book_id,num_page,content_text) VALUES (?,?,?)';
                var params = [bookPage.bookId,bookPage.numPage,bookPage.contentText];

                CassandraOperations.client.execute(query, params, { prepare: true }, function(err) {
                    if (err){
                        error('Something when wrong and the row was not updated '+err);
                        reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"Something when wrong and the row was not updated "+JSON.stringify(err)));
                    }
                    else {
                        info('Updated on the cluster');
                        resolve(new ServiceResponse(ServiceStatusResponse.CREATED));
                    }
                });
            // }


        })
    }

    update(bookPage: BookPage): Promise<ServiceResponse> {
        info("update page pour livre : "+bookPage.bookId+" et page text : "+bookPage.contentText);

        return new Promise<ServiceResponse>((resolve, reject) => {

            //FIXME ajout controle coherence valeur des champs selon type de page (image? text ? choix ?)
            if(bookPage == null){
                reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"The BookPage must not be null"));
            }

            // info("Result found from exists bookPage : "+res);
            // if(res){
            //     reject(new ServiceResponse(ServiceStatusResponse.RESOURCE_ALREADY_EXISTS,"The book title  : "+book.title+" already exists"));
            // }else{
            var query = 'UPDATE book_page set content_text = ? where numPage = ?';
            var params = [bookPage.contentText,bookPage.numPage];

            CassandraOperations.client.execute(query, params, { prepare: true }, function(err) {
                if (err){
                    error('Something when wrong and the row was not updated '+err);
                    reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"Something when wrong and the row was not updated "+JSON.stringify(err)));
                }
                else {
                    info('Updated on the cluster');
                    resolve(new ServiceResponse(ServiceStatusResponse.CREATED));
                }
            });
            // }


        })
    }
}