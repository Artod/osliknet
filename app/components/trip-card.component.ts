import {Component, Input} from 'angular2/core';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'trip-card',
	templateUrl: '/app/tmpls/trip-card.html',
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

























