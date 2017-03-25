import {Component} from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormGroup, FormBuilder, Validators, FormControl, AbstractControl} from "@angular/forms";
import {ServiceResponse} from "../../../../server/common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {UserService} from "../service/user.service";
import {UserForm} from "../model/userForm";
import {User} from "../model/user";
import {StorageService} from "../../common/storage/StorageService";
import {ContextUserService} from "../../common/context/ContextUserService";

@Component({
    selector: 'user-login',
    providers: [UserService],
    templateUrl: 'app/user/user-login/user-login.component.html',
    styleUrls: ['app/user/user-login/user-login.component.css']
})


export class UserLoginComponent implements OnInit {

    constructor(private userService: UserService,private contextUserService : ContextUserService, private  router: Router, private formBuilder: FormBuilder) {
    }

    form: FormGroup;
    submitted: boolean = false;
    userUnknown: boolean = false;

    onSubmit(userForm: UserForm, valid: boolean) {
        this.submitted = true;
          if(valid) {
             this.resetFormControlUserUnknown();
             let user: User = new User(userForm.username,userForm.password,null);

             console.log("user " +JSON.stringify(user));

             this.userService.authenticate(user)
                 .then((res: ServiceStatusResponse) => {
                     console.log("loge OK!!!");
                     this.contextUserService.setLogged(true);
                     this.router.navigate(['/allbooks']);
                 })
                 .catch((res: ServiceStatusResponse) => {
                     console.log("error log, resp : " + res);
                     if (res == ServiceStatusResponse.UNAUTHORIZED) {
                         console.log("unauthorized error form handle");
                         this.addErrorFormControlUserUnknown();
                     }
                 });
          }
    }


    resetFormControlUserUnknown() : void{
        let formControlUserUnknown : AbstractControl = this.form.get("userUnknown");
        formControlUserUnknown.setErrors(null);
    }

    addErrorFormControlUserUnknown() : void{
        let formControlUserUnknown : AbstractControl = this.form.get("userUnknown");
        formControlUserUnknown.setErrors({
            "userUnknown": true
        });
    }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            username: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required),
            userUnknown: new FormControl('')
        });
    }
}