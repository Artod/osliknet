import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';

// import {Order} from '../services/order/order';

@Component({
	templateUrl: '/app/tmpls/requests.html',
	directives: [ROUTER_DIRECTIVES]
})

export class RequestsComponent {
	public trips: any[];

	constructor(
		private orderService: OrderService
	) {
		this.orderService.getMy()
			.subscribe(trips => {
				this.trips = trips.map(trip => {
					trip.when = new Date(trip.when);

					return trip;
				});
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








