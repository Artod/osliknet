import {Component, Inject} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {UserService} from '../services/user/user.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/user.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [ToDatePipe]
})

export class UserComponent {
	public uid : string = '';
	public user : any = {};

	constructor(
		private _userService : UserService,
		private _routeParams : RouteParams,
		@Inject('config.user') public configUser
	) {
		this.uid = this._routeParams.get('id')
		
		this._userService.getById(this.uid).subscribe(res => {			
			this.user = res.user;
		}, error => {
			console.dir(error);
		});
	}
}








