import {Component, Inject, ApplicationRef, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

// import {ChatComponent} from './chat.component';
import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';

import {OrderService} from '../services/order/order.service';
import {NotificationService} from '../services/notification/notification.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/orders.html',
	directives: [ROUTER_DIRECTIVES, /*ChatComponent, */TripCardComponent, OrderCardComponent],
	pipes: [ToDatePipe]
})

export class OrdersComponent implements OnDestroy {
	public orders : any[] = [];
	public newMessages : any = {};
	private _notifSub;

	private _inited : boolean = false;
	
	constructor(
		private _orderService : OrderService,
		private _routeParams : RouteParams,
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef,
		@Inject('config.orderStatus') public configOrderStatus
	) {
		/*this._orderService.get().subscribe(data => {
			this.orders = data.orders || [];
			
			this._inited = true;
		}, error => {
			this._inited = true;
		});*/
		
		this.loadNext()
		
		this.newMessages = this._notificationService.data.newMessages || {};

		this._notifSub = this._notificationService.start().subscribe(data => {
			this.newMessages = data.newMessages || {};
			this._appRef.tick();
		});
	}
	
	public page : number = 0;
	public limit : number = 5;
	public fullPage : boolean = false;
	private _busy : boolean = false;

	public loadNext() : void {	
		this._busy = true;
		
		this._orderService.get(this.limit, this.page).subscribe(data => {
			(data.orders || []).forEach( (order) => {
				this.orders.push(order);
			} );
			
			if ( (data.orders || [])[this.limit - 1] ) {
				this.page++;
			} else {
				this.fullPage = true;
			}
			
			this._busy = false;
			this._inited = true;
		}, error => {
			
			this._busy = false;
			this._inited = true;
		});
	}
	
	public ngOnDestroy() : void {
		this._notifSub.unsubscribe();
	}
}








