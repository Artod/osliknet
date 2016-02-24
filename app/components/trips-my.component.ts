import {Component, Inject, ApplicationRef, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';
import {NotificationService} from '../services/notification/notification.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';


@Component({
	templateUrl: '/app/tmpls/trips-my.html',
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent],
	pipes: [ToDatePipe]
})

export class TripsMyComponent implements OnDestroy {
	public trips: any[];
	public ordersByTrip: any = {};
	public newMessages : any = {};
	private _notifSub;
	
	constructor(
		private _tripService: TripService,
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef,
		@Inject('config.orderStatus') public configOrderStatus
	) {
		this._tripService.getMy().subscribe(res => {	
			this.trips = <any[]>res.trips;
			
			res.orders.forEach( (order, i, arr) => {
				this.ordersByTrip[order.trip] = this.ordersByTrip[order.trip] || [];
				this.ordersByTrip[order.trip].push(order);
			});
		}, error => {
			console.dir(error);
		});
		
		this.newMessages = this._notificationService.data.newMessages;
		
		this._notifSub = this._notificationService.start().subscribe(data => {
console.log('TripsMyComponent subscribe TripsMyComponent subscribe TripsMyComponent subscribe TripsMyComponent subscribe');
			this.newMessages = data.newMessages;
			this._appRef.tick();
		});
	}
	
	public ngOnDestroy() : void {
		this._notifSub.unsubscribe();
	}
}

/*.subscribe(
                       heroes => this.heroes = heroes,
                       error =>  this.errorMessage = <any>error);
}*/








