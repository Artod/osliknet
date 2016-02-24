import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'trip-card',
	templateUrl: '/app/tmpls/trip-card.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [ToDatePipe]
	// inputs: ['name', 'model', 'class', 'form']
})

export class TripCardComponent {
	@Input() trip: any;	
	@Input() user: any;
	
	constructor(
		
	) {
		
	}
}

























