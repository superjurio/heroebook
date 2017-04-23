
import {CassandraOperations} from "../../../cassandra/CassandraOperations";
import {error, info} from "winston";
import * as _ from "lodash";
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../../common/repository/ServiceStatusResponse";
import {User} from "../../../../src/app/user/model/user";
import {UserAccountRepository} from "./UserAccountRepository";
import {injectable} from "inversify";
import {v4} from "node-uuid";

@injectable()
export class UserAccountCassandraRepository implements UserAccountRepository{

    add(user : User): Promise<ServiceResponse> {


        return new Promise<ServiceResponse>((resolve, reject) => {

            if(user == null || _.isEmpty(user.username)  || _.isEmpty(user.password)){
                reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"The user username and password must not be null"));
            }

            this.exists(user.username)
                .then((res) => {
                    info("Result found from exists user : "+res);
                    if(res){
                        reject(new ServiceResponse(ServiceStatusResponse.RESOURCE_ALREADY_EXISTS,"The user title  : "+user.username+" already exists"));
                    }else{
                        var query = 'INSERT INTO user (id,username,password) VALUES (?,?,?)';
                        var params = [v4(),user.username,user.password];

                        CassandraOperations.client.execute(query, params, { prepare: true }, function(err) {
                            if (err){
                                error('Something when wrong and the row was not updated '+err);
                                reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"Something when wrong and the row was not updated "+JSON.stringify(err)));
                            }
                            else {
                                info('Updated on the cluster');
                                resolve(new ServiceResponse(ServiceStatusResponse.CREATED));
                            }
                        });
                    }
                 })
                .catch((res) => {
                    reject(new ServiceResponse(ServiceStatusResponse.TECHNICAL_ERROR,"Problem to find book "+res));
                })

      })
    }

    find(username: String): Promise<User> {
        return new Promise<User>((resolve, reject) => {

            if(_.isEmpty(username)){
                reject('The username must not be null');
            }

            var query = 'SELECT * from user where username = ?';
            var params = [username];

            CassandraOperations.client.execute(query, params, { prepare: true }, function(err,result) {
                if (err){
                    error('Something when wrong'+JSON.stringify(err));
                    reject('Something when wrong'+JSON.stringify(err));
                }
                else {
                    let userFound : any = result.first();

                    if(!userFound){
                        resolve(null);
                    }else{
                        info('User found : '+JSON.stringify(userFound));
                        resolve(new User(userFound.username,userFound.password,userFound.id));
                    }
                }
            });
        })
    }

    exists(username: String): Promise<Boolean> {
        info("Check if user exists : ",username);

        return this.find(username)
            .then((res) => {
                return Promise.resolve(res!=null);
            })
            .catch((res) => {
                info("Problem to check user exists");
                return Promise.resolve(false);
             })
    }


}