import {Component, Input, Inject} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'user-card',
	templateUrl: '/client_src/tmpls/user-card.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [ToDatePipe]
	// inputs: ['name', 'model', 'class', 'form']
})

export class UserCardComponent {
	@Input() user: any;
	
	constructor(
		@Inject('config.user') public configUser
	) {
		
	}
}

























