import { Component } from '@angular/core';
import {ContextUserService} from "./common/context/ContextUserService";
import {UserService} from "./user/service/user.service";
import {ServiceStatusResponse} from "../../server/common/repository/ServiceStatusResponse";
@Component({
    selector: 'my-app',
    template: `  
    <custom-loader></custom-loader>
    <h1>Are you a Heroe </h1>
    <nav>
        <a *ngIf="isGuestUser()" routerLink="/login"  routerLinkActive="active">Se connecter</a> 
        <a *ngIf="!isGuestUser()"  (click)="logout()">Se déconnecter</a> 
        <a *ngIf="isGuestUser()" routerLink="/user" routerLinkActive="active">Créer un compte</a> 
        <a *ngIf="!isGuestUser()" routerLink="/book" routerLinkActive="active">Rédiger un bouquin</a> 
        <a *ngIf="!isGuestUser()" routerLink="/my-written-books" routerLinkActive="active">Voir mes créations</a> 
        <a routerLink="/allbooks" routerLinkActive="active">Consulter la bibliothéque</a> 
        <!--<a routerLink="/heroes" routerLinkActive="active">Menu 1</a>-->
        <!--<a routerLink="/dashboard" routerLinkActive="active">Menu 2</a> -->
    </nav>
 
     <router-outlet></router-outlet>
  `,
    styleUrls : ['/app/app.component.css']
})
export class AppComponent {


    constructor(private contextUserService : ContextUserService, private userService : UserService){
    }

    isGuestUser() : boolean{
        return !this.contextUserService.getCurrentContextUser().isLogged();
    }

    logout() : void {
        this.userService.logout().then((r : ServiceStatusResponse)=> {
            this.contextUserService.reset();
        });
 }
}
