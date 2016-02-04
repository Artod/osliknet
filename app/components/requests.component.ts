import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {ChatComponent} from '../components/chat.component';

import {OrderService} from '../services/order/order.service';

import {ToDatePipe} from '../pipes/to-date.pipe';
// import {ModalService} from '../services/modal/modal.service';

// import {Order} from '../services/order/order';

@Component({
	templateUrl: '/app/tmpls/requests.html',
	directives: [ROUTER_DIRECTIVES, ChatComponent],
	pipes: [ToDatePipe]
})

export class RequestsComponent {
	public orders: any[];
	public orderId: string;

	constructor(
		private orderService: OrderService,
		private routeParams: RouteParams
	) {	
		this.orderId = this.routeParams.get('id');
		
		this.orderService.get()
			.subscribe(orders => {		
				this.orders = orders;

				if (!this.orderId && this.orders.length) {
					this.orderId = this.orders[0]._id;
				}
			}, error => {
				console.dir(error);
			}, () => {
				console.log('done')
			});
	}
	
	private onClick(orderId) {
		this.orderId = orderId;
		console.log('new this.orderId = ', this.orderId);
	}
}

/*.subscribe(
                       heroes => this.heroes = heroes,
                       error =>  this.errorMessage = <any>error);
  }*/








