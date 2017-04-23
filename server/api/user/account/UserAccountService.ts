

 import {UserAccountResp} from "./UserAccountResp";
 export interface UserAccountService{

     subscribe(username : String, password : String) : Promise<UserAccountResp>;

     authenticate(username : String, password : String) : Promise<UserAccountResp>;
}