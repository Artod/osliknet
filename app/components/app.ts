import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';

import {MainPageComponent} from './main-page.component';

@Component({
    selector: 'app',
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES]
})



@RouteConfig([
	{path:'/', name: 'MainPage', component: MainPageComponent}
])

export class AppComponent { }