 import {ServiceResponse} from "../../../common/repository/ServiceResponse";
 import {User} from "../../../../src/app/user/model/user";
 export interface UserAccountRepository{

     add(user : User) : Promise<ServiceResponse>;

     find(username: String): Promise<User>
}