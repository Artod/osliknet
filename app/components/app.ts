import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {MainPageComponent} from './main-page.component';
import {TripService} from '../services/trip/trip.service';

@Component({
    selector: 'app',
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [HTTP_PROVIDERS, TripService]
})

@RouteConfig([
	{path:'/', name: 'MainPage', component: MainPageComponent}
])

export class AppComponent { }