 import {Book} from "../../../src/app/book/model/book";
 import {ServiceResponse} from "../../common/repository/ServiceResponse";
 export interface BookRepository{

     add(book : Book) : Promise<ServiceResponse>;

     find(title : String) : Promise<Book>;

     exists(title : String) : Promise<Boolean>

     findAll() : Promise<Book[]>

     findBooksByAuthor(authorUsername : String) : Promise<Book[]>

 }