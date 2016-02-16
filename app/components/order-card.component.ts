import {Component, Input, Inject} from 'angular2/core';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'order-card',
	templateUrl: '/app/tmpls/order-card.html',
	pipes: [ToDatePipe]
	// inputs: ['name', 'model', 'class', 'form']
})

export class OrderCardComponent {
	@Input() order: any;	
	@Input() user: any;
	
	constructor(
		@Inject('config.orderStatus') public configOrderStatus
	) {
		
	}
}
