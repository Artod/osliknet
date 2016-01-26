import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';

import {MainPageComponent} from './main-page.component';
import {TripAddComponent} from './trip-add.component';
import {TripService}  from '../services/trip/trip.service';
import {ModalService} from '../services/modal/modal.service';
   
@Component({
    selector: 'app',
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [HTTP_PROVIDERS, TripService, ModalService]
})
  
@RouteConfig([
	{path:'/', name: 'MainPage', component: MainPageComponent},
	{path:'/trips/add', name: 'TripAdd', component: TripAddComponent}
])

export class AppComponent {
	constructor(
		private _modalService: ModalService
	) {
		
	}	
	
	public openModal() {
		this._modalService.open(TripAddComponent);		
	}
}