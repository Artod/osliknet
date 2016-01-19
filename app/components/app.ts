/*(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'app',
      templateUrl: '/tmpls/app.html'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));*/

import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';


import {MainPageComponent} from './main-page.component';
import {HeroListComponent} from './hero-list.component';


@Component({
    selector: 'app',
	// directives: [ANGULAR2_GOOGLE_MAPS_DIRECTIVES]
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES]
})


@RouteConfig([
  {path:'/', name: 'MainPage', component: MainPageComponent},
  {path:'/heroes',        name: 'Heroes',       component: HeroListComponent},
  // {path:'/hero/:id',      name: 'HeroDetail',   component: HeroDetailComponent}
])

export class AppComponent { }