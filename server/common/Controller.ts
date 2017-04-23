
import {InputCtrl} from "./InputCtrl";
import {Router} from "express";
export interface Controller{

    createRouter(inputCtrl : InputCtrl) : Router;
}