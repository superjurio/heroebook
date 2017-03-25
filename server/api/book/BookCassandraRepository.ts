import {BookRepository} from "./BookRepository";
import {CassandraOperations} from "../../cassandra/CassandraOperations";
import {Book} from "../../../src/app/book/model/book";
import {error, info} from "winston";
import * as _ from "lodash";
import {ServiceResponse} from "../../common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../common/repository/ServiceStatusResponse";
import {injectable} from "inversify";
import {UUID, v4} from "node-uuid";

@injectable()
export class BookCassandraRepository implements  BookRepository{

    // private static _instance:BookCassandraRepository = new BookCassandraRepository();
    //
    // constructor() {
    //     if(BookCassandraRepository._instance){
    //         throw new Error("Error: Instantiation failed. Singleton module! Use .getInstance() instead of new.");
    //     }
    //     BookCassandraRepository._instance = this;
    // }
    //
    // public static getInstance():BookCassandraRepository {
    //     return BookCassandraRepository._instance;
    // }

    add(book: Book): Promise<ServiceResponse> {


        return new Promise<ServiceResponse>((resolve, reject) => {

            if(book == null || _.isEmpty(book.title)){
                reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"The book and title must not be null"));
            }

            this.exists(book.title)
                .then((res) => {
                    info("Result found from exists book : "+res);
                    if(res){
                        reject(new ServiceResponse(ServiceStatusResponse.RESOURCE_ALREADY_EXISTS,"The book title  : "+book.title+" already exists"));
                    }else{
                        var query = 'INSERT INTO book (id,title,description,cover_picture,author_pseudo,author_id) VALUES (?,?,?,?,?,?)';
                        var params = [v4(),book.title,book.description,book.fileCoverPic == null ? null: book.fileCoverPic.buffer,book.authorPseudo,book.authorId];

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
                    }
                 })
                .catch((res) => {
                    reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"Problem to find book "+res));
                })

      })
    }


    find(title: String): Promise<Book> {
        return new Promise<Book>((resolve, reject) => {

            if(_.isEmpty(title)){
                reject('The book and title must not be null');
            }

            var query = 'SELECT * from book where title = ?';
            var params = [title];

            CassandraOperations.client.execute(query, params, { prepare: true }, function(err,result) {
                if (err){
                    error('Something when wrong'+JSON.stringify(err));
                    reject('Something when wrong'+JSON.stringify(err));
                }
                else {
                    const bookFound = result.first();

                    if(!bookFound){
                        resolve(null);
                    }else{
                        let book : Book = new Book(bookFound.get("id")[0],bookFound.get("title")[0],bookFound.get("description")[0],null,bookFound.get("authorPseudo")[0],null);
                         info("book : "+bookFound);
                        resolve(book);
                    }
                }
            });
        })
    }


    findAll(): Promise<Book[]> {

        return new Promise<Book[]>((resolve, reject) => {

            let books : Book[] = Array<Book>();

            CassandraOperations.client.execute('SELECT * FROM book',
                function(err,result) {
                    if (err) {
                        error("ERROR "+err);
                        reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR, "Problem to find all book " + err));
                    } else {
                        if (result.rows.length > 0) {
                            for (var i = 0; i < result.rows.length; i++) {
                                const bookFound = result.rows[i];
                                info("current book from db : " + bookFound.title);
                                books.push(new Book(bookFound.id,bookFound.title,bookFound.description,bookFound.cover_picture,bookFound.auhor_pseudo,bookFound.author_id));
                                info("book author id :",bookFound.author_id)

                            }
                        }
                        resolve(books);
                    }
                }
            );
        });
    }


    findBooksByAuthor(authorUsername: String): Promise<Book[]> {
        return new Promise<Book[]>((resolve, reject) => {

            if(_.isEmpty(authorUsername)){
                reject('The authorUsername must not be null');
            }

            let books : Book[] = Array<Book>();

            var query = 'SELECT * FROM book where author_pseudo = ?';
            var params = [authorUsername];

            CassandraOperations.client.execute(query, params, { prepare: true }, function(err,result) {  
                    if (err) {
                        error("ERROR "+err);
                        reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR, "Problem to find findBooksByAuthor  " + err));
                    } else {
                        if (result.rows.length > 0) {
                            for (var i = 0; i < result.rows.length; i++) {
                                const bookFound : any = result.rows[i];
                                info("current book from db : " + bookFound.title);
                                books.push(new Book(bookFound.id,bookFound.title,bookFound.description,bookFound.cover_picture,bookFound.auhor_pseudo));
                            }
                        }
                        resolve(books);
                    }
                }
            );
        });    }

    exists(title: String): Promise<Boolean> {
        return this.find(title)
            .then((res) => {
                return Promise.resolve(res!=null);
            })
            .catch((res) => {
                return Promise.resolve(false);
            })
    }
}