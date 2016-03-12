import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {UserCardComponent} from './user-card.component';
import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'trip-card',
	templateUrl: '/client_src/tmpls/trip-card.html',
	directives: [ROUTER_DIRECTIVES, UserCardComponent],
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

























