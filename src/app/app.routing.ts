import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeroesComponent }      from './heroes/heroes-list/heroes.component';
import {DashBoardComponent} from "./dashboard/dashboard.components";
import {HeroDetailComponent} from "./heroes/hero-detail/hero-detail.component";
import {BookAddComponent} from "./book/book-add/book-add-component";
import {IndispoComponent} from "./error/indispo/indispo-component";
import {BooksComponent} from "./book/book-list/books.component";
import {UserAddComponent} from "./user/user-add/user-add-component";
import {UserLoginComponent} from "./user/user-login/user-login-component";
import {CanActivateAuthRequired} from "./routing/CanActivateAuthRequired";
import {MyWrittenBookComponent} from "./book/my-written-book/my-written-books.component";
import {BookEditPagesComponent} from "./book/book-edit-pages/book-edit-pages.component";
import {UnauthorizedComponent} from "./error/unauthorized/unauthorized-component";

const appRoutes: Routes = [
    {
        path: 'heroes',
        component: HeroesComponent
    },
    {
        path: 'dashboard',
        component: DashBoardComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
    },
    {
        path:'detail/:id',
        component: HeroDetailComponent
    },
    {
        path: 'book',
        component: BookAddComponent,
        canActivate: [CanActivateAuthRequired]
    },
    {
        path:'book/pages/edit/:id',
        component: BookEditPagesComponent
    },
    {
        path: 'user',
        component: UserAddComponent
    },
    {
        path: 'login',
        component: UserLoginComponent
    },
    {
        path: 'indispo',
        component: IndispoComponent
    },
    {
        path: 'unauthorized',
        component: UnauthorizedComponent
    },
    {
        path: 'allbooks',
        component: BooksComponent
    },
    {
        path: 'my-written-books',
        component: MyWrittenBookComponent,
        canActivate: [CanActivateAuthRequired]
    },
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
