import {Component} from 'angular2/core';
import {RouteParams} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';

@Component({
	templateUrl: '/app/tmpls/orders-id.html'
})

export class OrdersIdComponent {
	public trip: any = {
		user: {}
	};
	
	public order: any = {
		user: {}
	};
	
	public messages: any[];
	
	private orderId: number;

	constructor(
		private tripService: TripService,
		private routeParams: RouteParams
	) {		
		this.orderId = this.routeParams.get('id');
		
		this.tripService.getOrder(this.orderId).subscribe(json => {
			this.trip = json.trip;
			
			if (this.trip.when)
				this.trip.when = new Date(this.trip.when);
			
			this.order = (json.trip && json.trip.orders) || {};
			
			if (this.order.created_at)
				this.order.created_at = new Date(this.order.created_at);
			
			this.messages = json.messages.map(message => {
				message.created_at = new Date(message.created_at);
				
				return message;
			});
		}, error => {
			console.dir(error);
		}, () => {
			console.log('done');
		});
	}
}

/*.subscribe(
                       heroes => this.heroes = heroes,
                       error =>  this.errorMessage = <any>error);
}*/








