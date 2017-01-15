import { Component } from '@angular/core';
import {OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'custom-loader',
  template:'<div *ngIf="active" class="loading-progress"></div>',
  styleUrls : ['app/common/loader/loader.component.css']
  })


export class CustomLoaderComponent implements OnInit{

  private active : boolean = false;

  constructor(){}

  public show(): void {
    this.active = true;
  }

  public hide(): void {
    this.active = false;
  }

  ngOnInit(): void {

   }
}