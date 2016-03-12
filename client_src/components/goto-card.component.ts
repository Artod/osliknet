import {Component, Input} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

@Component({
	selector: 'goto',
	templateUrl: '/client_src/tmpls/goto-card.html',
	directives: [ROUTER_DIRECTIVES]
})

export class GotoComponent {
	@Input() order: any = {};	
	@Input() newMessages: any = {};
	
	constructor(
		
	) {
		
	}
}

























