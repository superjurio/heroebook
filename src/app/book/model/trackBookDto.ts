
export class TrackBookDto {
    authorId : string;
    bookId : string;

    constructor(authorId: string, bookId : string){
        this.authorId = authorId;
        this.bookId = bookId;
    }

}
