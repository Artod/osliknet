import {Component, Inject, ApplicationRef, OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

// import {ChatComponent} from './chat.component';
import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';

import {OrderService} from '../services/order/order.service';
import {NotificationService} from '../services/notification/notification.service';

import {ToDatePipe} from '../pipes/to-date.pipe';
// import {ModalService} from '../services/modal/modal.service';

// import {Order} from '../services/order/order';

@Component({
	templateUrl: '/app/tmpls/requests.html',
	directives: [ROUTER_DIRECTIVES, /*ChatComponent, */TripCardComponent, OrderCardComponent],
	pipes: [ToDatePipe]
})

export class RequestsComponent implements OnDestroy {
	public orders : any[];
	public newMessages : any = {};
	private _notifSub;

	constructor(
		private _orderService : OrderService,
		private _routeParams : RouteParams,
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef,
		@Inject('config.orderStatus') public configOrderStatus
	) {
		this._orderService.get().subscribe(orders => {

			this.orders = orders;
		}, error => {
			console.dir(error);
		}, () => {
			console.log('done');
		});
		
		this.newMessages = this._notificationService.data.newMessages;
		
		this._notifSub = this._notificationService.start().subscribe(data => {
console.log('RequestsComponent _notifSub subscribeRequestsComponent _notifSub subscribeRequestsComponent _notifSub subscribe');
			this.newMessages = data.newMessages;
			this._appRef.tick();
		});
	}
	
	public ngOnDestroy() : void {
		this._notifSub.unsubscribe();
	}
}








