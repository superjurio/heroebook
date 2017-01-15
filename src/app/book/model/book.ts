
export class Book {
    id : string;
    title : string;
    description : string;
    fileCoverPic : any;
    authorId: string;
    authorPseudo : string;

    constructor(id: string, title : string, description: string,fileCoverPic : File, authorPseudo : string){
        this.id = id;
        this.title = title;
        this.description = description;
        this.fileCoverPic = fileCoverPic;
        this.authorPseudo = authorPseudo;
    }

}
