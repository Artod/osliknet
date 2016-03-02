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
		this._orderService.get().subscribe(data => {
			this.orders = data.orders || [];
			
			this._inited = true;
		}, error => {
			this._inited = true;
		});
		
		this.newMessages = this._notificationService.data.newMessages || {};
console.log('this._notificationService.datathis._notificationService.datathis._notificationService.datathis._notificationService.data')
console.dir(this._notificationService.data)
		this._notifSub = this._notificationService.start().subscribe(data => {
console.log('RequestsComponent _notifSub subscribeRequestsComponent _notifSub subscribeRequestsComponent _notifSub subscribe');
			this.newMessages = data.newMessages || {};
			this._appRef.tick();
		});
	}
	
	public ngOnDestroy() : void {
		this._notifSub.unsubscribe();
	}
}








