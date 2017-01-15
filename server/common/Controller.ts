
import {Router} from "~express/lib/express";
import {InputCtrl} from "./InputCtrl";
export interface Controller{

    createRouter(inputCtrl : InputCtrl) : Router;
}