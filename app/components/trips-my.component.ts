import {Component, Inject, Injector, ApplicationRef, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, ComponentInstruction} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';
import {NotificationService} from '../services/notification/notification.service';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';
import {GotoComponent} from './goto-card.component';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/trips-my.html',
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent, GotoComponent],
	pipes: [ToDatePipe]
})

export class TripsMyComponent implements OnDestroy {
	public trips : any[] = [];
	public ordersByTrip : any = {};
	
	public newMessages : any = {};
	private _notifSub;
	
	private _inited : boolean = false;
	
	constructor(
		private _tripService: TripService,
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef,
		@Inject('config.orderStatus') public configOrderStatus
	) {
		console.log('constructor');
		/*this._tripService.getMy().subscribe(res => {	
			this.trips = <any[]>res.trips || [];
			
			(res.orders || []).forEach( (order, i, arr) => {
				this.ordersByTrip[order.trip] = this.ordersByTrip[order.trip] || [];
				this.ordersByTrip[order.trip].push(order);
			});
			
			this._inited = true;
		}, error => {
			this._inited = true;
		});*/
		
		this.loadNext();
		
		this.newMessages = this._notificationService.data.newMessages || {};
		
		this._notifSub = this._notificationService.start().subscribe(data => {
			this.newMessages = data.newMessages || {};
			this._appRef.tick();
		});
	}
	
	public routerOnActivate () : void {
		console.log('routerOnActivate');
		return false;
	}
	
	public page : number = 0;
	public limit : number = 5;
	public fullPage : boolean = false;
	private _busy : boolean = false;

	public loadNext() : void {	
		this._busy = true;
		
		this._tripService.getMy(this.limit, this.page).subscribe(res => {
			(res.trips || []).forEach( (trip) => {
				this.trips.push(trip);
			} );
			
			(res.orders || []).forEach( (order, i, arr) => {
				this.ordersByTrip[order.trip] = this.ordersByTrip[order.trip] || [];
				this.ordersByTrip[order.trip].push(order);
			});
			
			if ( (res.trips || [])[this.limit - 1] ) {
				this.page++;
			} else {
				this.fullPage = true;
			}
			
			this._busy = false;
			this._inited = true;
		}, error => {
			this.fullPage = true;
			this._busy = false;
			this._inited = true;
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








