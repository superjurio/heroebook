import {Router} from "~express/lib/express";
import * as express from 'express';
import {info} from "winston";
import {ControllerDecorator} from "../../../decorator/ControllerDecorator";
import {BookRepository} from "../BookRepository";
import {InputCtrl} from "../../../common/InputCtrl";
import {Controller} from "../../../common/Controller";
import container from "../../../common/aop/inversify.config";
import TYPES_INV from "../../../common/aop/aop-definition";
import {Book} from "../../../../src/app/book/model/book";
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {AuthentUtils} from "../../../common/authent/passport/AuthentUtils";


@ControllerDecorator()
export class MyWrittenBookController implements Controller{


    private bookRepository : BookRepository =  container.get<BookRepository>(TYPES_INV.BookRepository);

    createRouter(inputCtrl : InputCtrl): Router {
        return express.Router()
        .get('/my-written-books',AuthentUtils.userShouldBeLogged,(req, resGet,next) => {
            info("find my-written-books");
            this.bookRepository.findBooksByAuthor(req.user.username)
                .then((res : Book[]) => {
                    info("results success from find findBooksByAuthor ");
                    if(res.length > 0){
                        resGet.status(200).json(res);
                        resGet.end();
                    }else{
                        resGet.status(200).json(new Array<Book>());
                    }
                    resGet.end();
                })
                .catch((res : ServiceResponse) => {
                    info("results error from findBooksByAuthor : "+JSON.stringify(res));
                    resGet.status(500).send({error : res.msg});
                })
        });
    }

}