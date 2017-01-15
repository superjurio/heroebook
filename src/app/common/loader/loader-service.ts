import {Injectable, ViewContainerRef, ComponentFactoryResolver, ComponentRef} from '@angular/core';
import {Headers, Http, Response} from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {ServiceStatusResponse} from "../../../../server/common/repository/ServiceStatusResponse";
import {HttpUtils} from "../../common/service/HttpUtils";
import {CustomLoaderComponent} from "./loader.component";


@Injectable()
export class LoaderService{

    constructor(private componentFactoryResolver: ComponentFactoryResolver) { }


    public addLoaderComponent(viewContainer: ViewContainerRef): ComponentRef<CustomLoaderComponent> {
      return viewContainer.createComponent(this.componentFactoryResolver.resolveComponentFactory(CustomLoaderComponent));
  }

}