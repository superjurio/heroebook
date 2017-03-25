import {NgModule, CUSTOM_ELEMENTS_SCHEMA}       from '@angular/core';
import { BrowserModule }  from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule}    from '@angular/forms';
import { AppComponent }        from './app.component';
import { HeroDetailComponent } from './heroes/hero-detail/hero-detail.component';
import { HeroesComponent }     from './heroes/heroes-list/heroes.component';
import { HeroService }         from './heroes/common/hero.service';
import { routing } from './app.routing';
import {DashBoardComponent} from "./dashboard/dashboard.components";
import {HttpModule, Http, RequestOptions, XHRBackend}    from '@angular/http';
import {HeroSearchComponent} from "./heroes/hero-search/hero-search.component";
import {BookAddComponent} from "./book/book-add/book-add-component";
import {BookService} from "./book/service/book.service";
import {CustomHttp} from "./error/CustomHttp";
import {Router} from "@angular/router";
import {IndispoComponent} from "./error/indispo/indispo-component";
import {BooksComponent} from "./book/book-list/books.component";
import {FileUploadComponent} from "./common/fileupload/component/file-upload-component";
import {CustomLoaderComponent} from "./common/loader/loader.component";
import {UserAddComponent} from "./user/user-add/user-add-component";
import {UserService} from "./user/service/user.service";
import {UserLoginComponent} from "./user/user-login/user-login-component";
import {StorageService} from "./common/storage/StorageService";
import {ContextUserService} from "./common/context/ContextUserService";
import {CanActivateAuthRequired} from "./routing/CanActivateAuthRequired";
import {MyWrittenBookComponent} from "./book/my-written-book/my-written-books.component";
import {BookEditPagesComponent} from "./book/book-edit-pages/book-edit-pages.component";
import {BookEditPagesService} from "./book/service/book-edit-pages.service";
import {UnauthorizedComponent} from "./error/unauthorized/unauthorized-component";
import {NotificationBookService} from "./book/service/notification.book.service";
import {NotificationComponent} from "./notification/notification-component";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        routing,
        HttpModule,
        ReactiveFormsModule
    ],
    declarations: [
        AppComponent,
        HeroDetailComponent,
        HeroesComponent,
        DashBoardComponent,
        HeroSearchComponent,
        BookAddComponent,
        UserAddComponent,
        UserLoginComponent,
        IndispoComponent,
        BooksComponent,
        FileUploadComponent,
        CustomLoaderComponent,
        MyWrittenBookComponent,
        BookEditPagesComponent,
        UnauthorizedComponent,
        NotificationComponent
    ],
    providers: [
        HeroService,
        BookService,
        UserService,
        StorageService,
        ContextUserService,
        BookEditPagesService,
        NotificationBookService,
        CanActivateAuthRequired,
        {
        provide: Http, useFactory: (backend: XHRBackend, options: RequestOptions, router: Router, contextUserService : ContextUserService) => {
                 return new CustomHttp(backend, options,router,contextUserService);
            }, deps: [XHRBackend , RequestOptions,Router,ContextUserService]
        },
    ],
    entryComponents: [CustomLoaderComponent],
    bootstrap: [ AppComponent ]
})
export class AppModule {
}
