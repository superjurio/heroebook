import {
    Component, ViewChild, ApplicationRef, ComponentFactoryResolver, ViewContainerRef,
    ComponentRef
} from '@angular/core';
import {OnInit} from '@angular/core';
import { Router } from '@angular/router';
import {BookService} from "../service/book.service";
import {Book} from "../model/book";
import {CustomLoaderComponent} from "../../common/loader/loader.component";
import {LoaderService} from "../../common/loader/loader-service";

@Component({
  selector: 'my-heroes',
  providers : [BookService,LoaderService],
  templateUrl:'app/book/book-list/books.component.html',
  styleUrls : ['app/book/book-list/books.component.css']
  })


export class BooksComponent implements OnInit{

  // @ViewChild('myCustomLoader') loaderComponent: CustomLoaderComponent;

  private loaderComponent : ComponentRef<CustomLoaderComponent>;

  constructor(private bookService : BookService, private  router : Router,private viewContainer: ViewContainerRef,private componentFactoryResolver: ComponentFactoryResolver,private loaderService : LoaderService){
    this.loaderComponent = loaderService.addLoaderComponent(viewContainer);
  }

  selectedBook : Book;

  books : Book[];

  onSelect(book : Book): void {
  	this.selectedBook = book;
  }

  getBooks() : void {
    this.loaderComponent.instance.show();
    this.bookService.getAll().
    then((books : Book[])=>{
        console.log("books retreived : "+books);
        this.books = books;
      this.loaderComponent.instance.hide();
    })
   }

  accessBookDetail(book : Book): void {
    this.bookService.trackVisitBook(book);
    // this.router.navigate(['/book/pages/edit', book.id]);
  }

  ngOnInit(): void {
    this.getBooks();
  }
}