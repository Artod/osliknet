import {Component, Input, Inject} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'order-card',
	templateUrl: '/app/tmpls/order-card.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [ToDatePipe]
})

export class OrderCardComponent {
	@Input() order : any;	
	@Input() user : any;
	
	constructor(
		@Inject('config.orderStatus') public configOrderStatus
	) {
		
	}
}
