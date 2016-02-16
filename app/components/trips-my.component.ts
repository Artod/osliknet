import {Component, Inject} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';

@Component({
	templateUrl: '/app/tmpls/trips-my.html',
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent],
	pipes: [ToDatePipe]
})

export class TripsMyComponent {
	public trips: any[];
	public ordersByTrip: any = {};

	constructor(
		private tripService: TripService,
		@Inject('config.orderStatus') public configOrderStatus
	) {
		this.tripService.getMy()
			.subscribe(res => {
				/*this.trips = res.trips.map(trip => {
					trip.when = new Date(trip.when);

					return trip;
				});*/
				
				this.trips = res.trips;
				
				res.orders.forEach( (order, i, arr) => {
					//order.creted_at = new Date(order.creted_at);
					
					this.ordersByTrip[order.trip] = this.ordersByTrip[order.trip] || [];
					this.ordersByTrip[order.trip].push(order);
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








