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
import {MyWrittenBookService} from "../service/my-written-book.service";

@Component({
  selector: 'my-heroes',
  providers : [MyWrittenBookService,LoaderService],
  templateUrl:'app/book/my-written-book/my-written-books.component.html',
  styleUrls : ['app/book/my-written-book/my-written-books.component.css']
  })


export class MyWrittenBookComponent implements OnInit{

  // @ViewChild('myCustomLoader') loaderComponent: CustomLoaderComponent;

  private loaderComponent : ComponentRef<CustomLoaderComponent>;

  constructor(private myWrittenBookService : MyWrittenBookService, private  router : Router,private viewContainer: ViewContainerRef,private componentFactoryResolver: ComponentFactoryResolver,private loaderService : LoaderService){
    this.loaderComponent = loaderService.addLoaderComponent(viewContainer);
  }

  selectedBook : Book;

  books : Book[];

  editPages(book : Book): void {
    this.router.navigate(['/book/pages/edit', book.id]);
  }

  getBooks() : void {
    this.loaderComponent.instance.show();
    this.myWrittenBookService.findMyBooks().
    then((books : Book[])=>{
        console.log("books retreived : "+books);
        this.books = books;
      this.loaderComponent.instance.hide();
    })
   }


  ngOnInit(): void {
    this.getBooks();
  }
}