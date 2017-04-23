import * as express from 'express';
import {BookRepository} from "./BookRepository";
import {ControllerDecorator} from "../../decorator/ControllerDecorator";
import {Book} from "../../../src/app/book/model/book";
import {Controller} from "../../common/Controller";
 import {info} from "winston";
import {ServiceResponse} from "../../common/repository/ServiceResponse";
import {ServiceStatusResponse} from "../../common/repository/ServiceStatusResponse";
import {InputCtrl} from "../../common/InputCtrl";
import {AuthentUtils} from "../../common/authent/passport/AuthentUtils";
import container from "../../common/aop/inversify.config";
import TYPES_INV from "../../common/aop/aop-definition";
import {Router} from "express";


@ControllerDecorator()
export class BookController implements Controller{


    private bookRepository : BookRepository =  container.get<BookRepository>(TYPES_INV.BookRepository);

    createRouter(inputCtrl : InputCtrl): Router {
        return express.Router().

        post('/book',AuthentUtils.userShouldBeLogged,inputCtrl.multer.single("coverPicFile"), (req : any, resPost, next) => {

            var title = req.body.title;
            var description = req.body.description;
            var coverPicData = req.file;

            info("coverPicData: "+coverPicData);
            info("body : "+JSON.stringify(req.body));
            info("title to create: "+title);

            this.bookRepository.add(new Book(null,title,description,coverPicData,req.user.username,req.user.id))
            .then((res : ServiceResponse) => {
                info("results success from add book : "+JSON.stringify(res));
                resPost.sendStatus(200);
            })
            .catch((res : ServiceResponse) => {
                info("results error from add book : "+JSON.stringify(res));
                if(res.status == ServiceStatusResponse.RESOURCE_ALREADY_EXISTS){
                    resPost.status(409).send({error: res.msg});
                }else if(res.status == ServiceStatusResponse.TECHNICAL_ERROR){
                    resPost.status(500).send({error : res.msg});
                }
             })
        })

        .get('/book',(req, resGet,next) => {
            info("find all books");
            this.bookRepository.findAll()
                .then((res : Book[]) => {
                    info("results success from find all book");
                    if(res.length > 0){
                        resGet.status(200).json(res);
                        resGet.end();
                    }else{
                        resGet.status(200).json(new Array<Book>());
                    }
                    resGet.end();
                })
                .catch((res : ServiceResponse) => {
                    info("results error from find all book : "+JSON.stringify(res));
                    resGet.status(500).send({error : res.msg});
                })
        });
    }

}