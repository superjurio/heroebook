import "reflect-metadata";
import {RoutingExpressInjection} from "../RoutingInjection";
import {info} from "winston";

export function ControllerDecorator(): Function {
    return (targetClass: Function): void => {
        RoutingExpressInjection.getInstance().addController(targetClass);
    };
}