import {Component} from 'angular2/core';
import {RouteConfig, ROUTER_DIRECTIVES} from 'angular2/router';
import {HTTP_PROVIDERS} from 'angular2/http';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FORM_PROVIDERS} from 'angular2/common';

import {TripsComponent}    from './trips.component';
import {TripAddComponent}  from './trip-add.component';
import {TripsMyComponent}  from './trips-my.component';
import {RequestsComponent} from './requests.component';
import {ChatComponent}     from './chat.component';
// import {OrdersIdComponent} from './orders-id.component';

import {TripService}    from '../services/trip/trip.service';
import {OrderService}   from '../services/order/order.service';
import {ModalService}   from '../services/modal/modal.service';
import {MessageService} from '../services/message/message.service';

@Component({
    selector: 'app',
	templateUrl: '/app/tmpls/app.html',
	directives: [ROUTER_DIRECTIVES, FORM_DIRECTIVES, CORE_DIRECTIVES],
	providers: [HTTP_PROVIDERS, FORM_PROVIDERS, TripService, OrderService, ModalService, MessageService]
})

@RouteConfig([
	{path:'/trips', name: 'Trips', component: TripsComponent},
	{path:'/trips/add', name: 'TripAdd', component: TripAddComponent},
	{path:'/trips/my', name: 'TripsMy', component: TripsMyComponent},
	// {path:'/orders/:id', name: 'OrdersId', component: OrdersIdComponent},
	// {path:'/requests/:id', name: 'RequestsId', component: RequestsComponent},
	{path:'/requests', name: 'Requests', component: RequestsComponent},
	{path:'/messages/request/:id', name: 'Chat', component: ChatComponent}
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