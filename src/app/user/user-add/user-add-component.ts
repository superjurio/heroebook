import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {ServiceResponse} from "../../../../server/common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {UserService} from "../service/user.service";
import {UserForm} from "../model/userForm";
import {User} from "../model/user";
import {ContextUserService} from "../../common/context/ContextUserService";

@Component({
    selector: 'user-add',
    providers: [UserService],
    templateUrl: 'app/user/user-add/user-add.component.html',
    styleUrls: ['app/user/user-add/user-add.component.css']
})


export class UserAddComponent implements OnInit {

    constructor(private userService: UserService, private  router: Router, private formBuilder: FormBuilder,private contextUserService : ContextUserService) {
    }

    form: FormGroup;
    submitted: boolean = false;
    userAlreadyExists: boolean = false;

    onSubmit(userForm: UserForm, valid: boolean) {
        this.submitted = true;
          if(valid) {
             this.resetFormControlUsernameUnique();
             let user: User = new User(userForm.username,userForm.password,null);

             console.log("user " +JSON.stringify(user));

             this.userService.create(user)
                 .then((res: ServiceStatusResponse) => {
                     console.log("cree!!!");
                     this.contextUserService.setLogged(true);
                     this.router.navigate(['/allbooks']);
                 })
                 .catch((res: ServiceStatusResponse) => {
                     console.log("error creation, resp : " + res);
                     if (res == ServiceStatusResponse.RESOURCE_ALREADY_EXISTS) {
                         this.addErrorFormControlUsernameUnique();
                     }
                 });
          }
    }


    resetFormControlUsernameUnique() : void{
        let formControlUsernameUnique : AbstractControl = this.form.get("usernameUnique");
        formControlUsernameUnique.setErrors(null);
    }

    addErrorFormControlUsernameUnique() : void{
        let formControlUsernameUnique : AbstractControl = this.form.get("usernameUnique");
        formControlUsernameUnique.setErrors({
            "notUnique": true
        });
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            usernameUnique: new FormControl('')
        });
    }
}