
  import {BookPage} from "../../../../src/app/book/book-edit-pages/bookPage";
  import {ServiceResponse} from "../../../common/repository/ServiceResponse";
  export interface EditBookPagesRepository{

     findPagesByBookId(bookId: String): Promise<BookPage[]>;

     add(bookPage : BookPage) : Promise<ServiceResponse>;

     update(bookPage : BookPage) : Promise<ServiceResponse>;

  }