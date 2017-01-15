
export class BookPage {

     bookId : string;
     numPage : number;
     contentText : string;
     newPage : boolean = true;

    constructor(bookId : string, numPage: number, contentText: string,newPage : boolean) {
        this.bookId = bookId;
        this.numPage = numPage;
        this.contentText = contentText;
        this.newPage = newPage;
    }
}
