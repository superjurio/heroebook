import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {BookService} from "../service/book.service";
import {BookForm} from "../model/bookForm";
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {ServiceResponse} from "../../../../server/common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {Book} from "../model/book";

@Component({
    selector: 'book-add',
    providers: [BookService],
    templateUrl: 'app/book/book-add/book-add.component.html',
    styleUrls: ['app/book/book-add/book-add.component.css']
})


export class BookAddComponent implements OnInit {

    constructor(private bookService: BookService, private  router: Router, private formBuilder: FormBuilder) {
    }

    form: FormGroup;
    submitted: boolean = false;
    bookAlreadyExists: boolean = false;

    onSubmit(bookForm: BookForm, valid: boolean) {
        this.submitted = true;
          if(valid) {
             this.resetFormControlTitleUnique();
             console.log("this.filesToUpload " +bookForm.filesToUpload);
             console.log("this.filesToUpload.name " +bookForm.filesToUpload.name);
             let book: Book = new Book(null,bookForm.title,bookForm.description,bookForm.filesToUpload,null,null);

             console.log("book " +JSON.stringify(book));

             this.bookService.create(book)
                 .then((res: ServiceStatusResponse) => {
                     console.log("cree!!!");
                 })
                 .catch((res: ServiceStatusResponse) => {
                     console.log("error creation, resp : " + res);
                     if (res == ServiceStatusResponse.RESOURCE_ALREADY_EXISTS) {
                         this.addErrorFormControlTitleUnique();
                     }
                 });
          }
    }


    resetFormControlTitleUnique() : void{
        let formControlTitleUnique : AbstractControl = this.form.get("titleUnique");
        formControlTitleUnique.setErrors(null);
    }

    addErrorFormControlTitleUnique() : void{
        let formControlTitleUnique : AbstractControl = this.form.get("titleUnique");
        formControlTitleUnique.setErrors({
            "notUnique": true
        });
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            title: new FormControl('', Validators.required),
            description: new FormControl('', Validators.required),
            coverPic: new FormControl(''),
            filesToUpload : new FormControl(''),
            titleUnique: new FormControl('')
        });
    }
}