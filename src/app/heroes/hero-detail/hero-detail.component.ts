import { Component, Input, OnInit } from '@angular/core';
import {Hero} from "../common/hero";
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import {HeroService} from "../common/hero.service";

@Component({
    selector : 'my-hero-detail',
    templateUrl: 'app/heroes/hero-detail/hero-detail.component.html'
})


export class HeroDetailComponent implements OnInit{

    @Input()
    hero: Hero;
    constructor(
        private heroService: HeroService,
        private route: ActivatedRoute,
        private location: Location
    ) {}

    goBack(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.route.params.forEach((params: Params) => {
            let id = +params['id'];
            this.heroService.getHero(id)
                .then(hero => this.hero = hero);
        });
    }

    save(): void{
        this.heroService.update(this.hero).then(()=> this.goBack());
    }
}