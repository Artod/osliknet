import {Component} from 'angular2/core';

import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';

// import {Order} from '../services/order/order';

@Component({
	templateUrl: '/app/tmpls/requests.html'
})

export class RequestsComponent {
	public trips: any[];

	constructor(
		private orderService: OrderService
	) {
		this.orderService.getMy()
			.subscribe(trips => {
				this.trips = trips;
				// console.dir(orders)
			}, error => {
				console.dir(error);
			}, () => {
				console.log('done')
			});
	}
}

/*.subscribe(
                       heroes => this.heroes = heroes,
                       error =>  this.errorMessage = <any>error);
  }*/








