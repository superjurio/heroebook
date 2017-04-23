export class BookVisited {


    private _authorId : String;
    private _bookId : String;


    constructor(authorId: String, bookId: String) {
        this._authorId = authorId;
        this._bookId = bookId;
    }

    get authorId(): String {
        return this._authorId;
    }

    get bookId(): String {
        return this._bookId;
    }
}