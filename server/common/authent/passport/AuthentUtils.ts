import {UserAccountResp} from "../../../api/user/account/UserAccountResp";
import {info} from "winston";
import {Response} from "~express/lib/express";
export class AuthentUtils{

    public static login(req, resp: UserAccountResp, res) {
        req.login(resp.getUser(), function (err) {
            if (!err) {
                info("after log session id : " + req.sessionID);
                res.sendStatus(200);
            } else {
                res.status(500).send({error: "problem to login"});
            }
        });
    }

    public static checkUserIsLogged(req, res, next) : Response {
        info("check user is logged");
        if (req.user) {
            info("=> user is logged");
            return res.sendStatus(200);
        } else {
            info("user not logged");
            next();
        }
    }

    public static userShouldBeLogged(req, res, next) : Response {
        info("check user is logged");
        if (req.user) {
            info("=> user is logged");
            next();
        } else {
            info("user not logged");
            return res.sendStatus(401);
        }
    }

}