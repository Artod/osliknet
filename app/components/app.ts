import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FORM_PROVIDERS} from 'angular2/common';

import {MainPageComponent} from './main-page.component';
import {TripAddComponent} from './trip-add.component';
import {TripsMyComponent} from './trips-my.component';
import {RequestsComponent} from './requests.component';
import {TripService}  from '../services/trip/trip.service';
import {OrderService}  from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';
  
@Component({
    selector: 'app',
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
	providers: [HTTP_PROVIDERS, FORM_PROVIDERS, TripService, OrderService, ModalService]
})
  
@RouteConfig([
	{path:'/', name: 'MainPage', component: MainPageComponent},
	{path:'/trips/add', name: 'TripAdd', component: TripAddComponent},
	{path:'/trips/my', name: 'TripsMy', component: TripsMyComponent},
	{path:'/requests', name: 'Requests', component: RequestsComponent}
])

export class AppComponent {
	constructor(
		private _modalService: ModalService
	) {
		
	}
	
	public openModal() {
		this._modalService.open();
	}
}