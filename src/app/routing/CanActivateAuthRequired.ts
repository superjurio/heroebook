import {CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import {Observable} from "rxjs";
import {ContextUserService} from "../common/context/ContextUserService";
import {Injectable} from "@angular/core";

@Injectable()
export class CanActivateAuthRequired implements CanActivate {


    constructor(private router: Router, private contextUserService: ContextUserService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean>|Promise<boolean>|boolean {
        if (!this.contextUserService.getCurrentContextUser().isLogged()) {
            console.log("not logged");
            this.router.navigate(['/login']);
            return false;
        }
        console.log("logged");
        return true;
    }
}