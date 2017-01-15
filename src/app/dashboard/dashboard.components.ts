import { Component, OnInit } from '@angular/core';
import { Hero } from '../heroes/common/hero';
import { HeroService } from '../heroes/common/hero.service';
import { Router } from '@angular/router';

@Component({
    selector : 'my-dashboard',
    templateUrl: 'app/dashboard/dashboard.component.html',
    styleUrls : ['app/dashboard/dashboard.component.css']
})

export class DashBoardComponent implements OnInit{

    heroes: Hero[] = [];

    constructor(
        private router: Router,
        private heroService: HeroService) {
    }

    ngOnInit(): void {
        this.heroService.getHeroes()
            .then(heroes => this.heroes = heroes.slice(1, 5));
    }

    gotoDetail(hero: Hero): void {
        let link = ['/detail',hero.id];
        this.router.navigate(link);
    }

}

