import {Router} from "~express/lib/express";
import * as express from 'express';
import {info} from "winston";
import {ControllerDecorator} from "../../../decorator/ControllerDecorator";
import {InputCtrl} from "../../../common/InputCtrl";
import {Controller} from "../../../common/Controller";
import container from "../../../common/aop/inversify.config";
import TYPES_INV from "../../../common/aop/aop-definition";
import {Book} from "../../../../src/app/book/model/book";
import {ServiceResponse} from "../../../common/repository/ServiceResponse";
import {AuthentUtils} from "../../../common/authent/passport/AuthentUtils";
import {EditBookPagesRepository} from "./EditBookPagesRepository";
import {BookPage} from "../../../../src/app/book/book-edit-pages/bookPage";
import {ServiceStatusResponse} from "../../../common/repository/ServiceStatusResponse";


@ControllerDecorator()
export class EditBookPagesController implements Controller{


    private editBookPagesRepository : EditBookPagesRepository =  container.get<EditBookPagesRepository>(TYPES_INV.EditBookPagesRepository);

    createRouter(inputCtrl : InputCtrl): Router {
        return express.Router()
        .get('/book-edit-pages',AuthentUtils.userShouldBeLogged,(req, resGet,next) => {
            info("book pages");
            this.editBookPagesRepository.findPagesByBookId(req.query.bookId)
                .then((res : BookPage[]) => {
                    info("results success from find findPagesByBookId ");
                    if(res.length > 0){
                        resGet.status(200).json(res);
                        resGet.end();
                    }else{
                        resGet.status(200).json(new Array<Book>());
                    }
                    resGet.end();
                })
                .catch((res : ServiceResponse) => {
                    info("results error from findPagesByBookId : "+JSON.stringify(res));
                    resGet.status(500).send({error : res.msg});
                })
        })
            .
        post('/book-edit-pages' ,AuthentUtils.userShouldBeLogged,inputCtrl.multer.single("coverPicFile"), (req, resPost, next) => {

            var contentText = req.body.contentText;
            var num = req.body.numPage;
            var bookId = req.body.bookId;
            var newPage = req.body.newPage;

            info("body : "+JSON.stringify(req.body));

            if(newPage){
                this.editBookPagesRepository.add(new BookPage(bookId,num,contentText,null))
                    .then((res : ServiceResponse) => {
                        info("results success from add pages : "+JSON.stringify(res));
                        resPost.sendStatus(200);
                    })
                    .catch((res : ServiceResponse) => {
                        info("results error from add pages : "+JSON.stringify(res));
                        if(res.status == ServiceStatusResponse.RESOURCE_ALREADY_EXISTS){
                            resPost.status(409).send({error: res.msg});
                        }else if(res.status == ServiceStatusResponse.TECHNICAL_ERROR){
                            resPost.status(500).send({error : res.msg});
                        }
                    })
            }else{
                this.editBookPagesRepository.update(new BookPage(bookId,num,contentText,null))
                    .then((res : ServiceResponse) => {
                        info("results success from update pages : "+JSON.stringify(res));
                        resPost.sendStatus(200);
                    })
                    .catch((res : ServiceResponse) => {
                        info("results error from update pages : "+JSON.stringify(res));
                        if(res.status == ServiceStatusResponse.TECHNICAL_ERROR){
                            resPost.status(500).send({error : res.msg});
                        }
                    })
            }

        })
    }

}