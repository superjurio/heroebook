import { Component } from '@angular/core';
import {Hero} from "../common/hero";
import {HEROES} from "../common/mock-heroes";
import {HeroService} from "../common/hero.service";
import {OnInit} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'my-heroes',
  providers : [HeroService],
  templateUrl:'app/heroes/heroes-list/heroes.component.html',
  styleUrls : ['app/heroes/heroes-list/heroes.component.css']
  })


export class HeroesComponent implements OnInit{

  constructor(private heroService : HeroService, private  router : Router){}

  selectedHero : Hero;

  heroes = HEROES;

  onSelect(hero : Hero): void {
  	this.selectedHero = hero;
  }

  getHeroes() : void {
    this.heroService.getHeroes().then(
        heroes => this.heroes = heroes
    );
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedHero.id]);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) { return; }
    this.heroService.create(name)
        .then(hero => {
          this.heroes.push(hero);
          this.selectedHero = null;
        });
  }

  delete(hero: Hero): void {
    this.heroService
        .delete(hero.id)
        .then(() => {
          this.heroes = this.heroes.filter(h => h !== hero);
          if (this.selectedHero === hero) { this.selectedHero = null; }
        });
  }

  ngOnInit(): void {
    this.getHeroes();
  }
}