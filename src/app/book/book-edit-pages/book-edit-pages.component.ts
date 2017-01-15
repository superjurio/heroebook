import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {BookEditPagesService} from "../service/book-edit-pages.service";
import {BookPage} from "./bookPage";
import {FormGroup, Validators, FormControl, FormBuilder} from "@angular/forms";
import {BookPageForm} from "./bookPageForm";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import _ = require("lodash");

@Component({
    selector : 'book-edit-pages',
    providers: [BookEditPagesService],
    templateUrl: 'app/book/book-edit-pages/book-edit-pages.component.html',
    styleUrls: ['app/book/book-edit-pages/book-edit-pages.component.css']
})


export class BookEditPagesComponent implements OnInit{

    // @Input()

    bookId: string;
    bookPages : BookPageForm[] = new Array();

    form: FormGroup;
    submitted: boolean = false;
    // currentBookPage : BookPageForm = new BookPageForm();

    constructor(
        private bookEditPagesService: BookEditPagesService,
        private route: ActivatedRoute,
        private location: Location,
        private formBuilder: FormBuilder
    ) {}

    onSelect(bookPageSelected : BookPageForm): void {
        this.form.controls['contentText'].setValue(bookPageSelected.contentText);
        this.form.controls['numPage'].setValue(bookPageSelected.numPage);
    }

    onSubmit(bookPageForm: BookPageForm, valid: boolean) {
        this.submitted = true;
        console.log("form : ",bookPageForm);

        if(valid) {
            let bookPage: BookPage = new BookPage(this.bookId,
                !_.isEmpty(bookPageForm.numPage) ? bookPageForm.numPage : this.bookPages.length+1,
                bookPageForm.contentText,
                !_.isEmpty(bookPageForm.numPage) ? false : true);

            console.log("bookPage " +JSON.stringify(bookPage));

            this.bookEditPagesService.create(bookPage)
                .then((res: ServiceStatusResponse) => {
                    console.log("cree!!!");
                    if(bookPage.newPage){
                        this.bookPages.push(bookPage);
                    }
                 })
                .catch((res: ServiceStatusResponse) => {
                    console.log("error creation, resp : " + res);
                });
        }
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id : string = params['id'];
            this.bookId = id;
            this.bookEditPagesService.findPagesByBookId(id)
                .then(bookPages => {
                    for (let bp of bookPages) {
                        let bookPageForm : BookPageForm =  new BookPageForm();
                        bookPageForm.numPage = bp.numPage;
                        bookPageForm.contentText = bp.contentText;
                        this.bookPages.push(bookPageForm);
                    }
                });
        });

        this.form = this.formBuilder.group({
            contentText: new FormControl('', Validators.required),
            numPage: new FormControl('')
        });
    }


}