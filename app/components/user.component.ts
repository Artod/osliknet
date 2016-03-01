import {Component, Inject} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {UserService} from '../services/user/user.service';
import {ReviewService}  from '../services/review/review.service';

import {UserCardComponent} from './user-card.component';
import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/user.html',
	directives: [ROUTER_DIRECTIVES, UserCardComponent],
	pipes: [ToDatePipe]
})

export class UserComponent {
	public uid : string = '';
	public user : any = {};
	public reviews : any[];
	
	public formModel : any = {};
	public form : ControlGroup;
	
	private _ratings : Array = [1, 2, 3, 4, 5];
	
	public tRating : [] = [0, 0];
	public rRating : [] = [0, 0];

	constructor(
		private _fb : FormBuilder,
		private _userService : UserService,
		private _reviewService : ReviewService,
		private _routeParams : RouteParams,
		@Inject('config.user') public configUser
	) {
		this.form = this._fb.group({ 
			about: ''//['', Validators.required]
		});
		
		this.uid = this._routeParams.get('id')
		
		this._userService.getById(this.uid).subscribe(res => {			
			this.user = res.user;
			
			this.user && (this.formModel.about = this.user.about);

			if (this.user && this.user.stats) {
				this.tRating = this._reviewService.calculateRating(this.user.stats.t_rate);
				this.rRating = this._reviewService.calculateRating(this.user.stats.r_rate);
			}
			
		}, error => {});
		
		this._reviewService.get().subscribe(res => {			
			this.reviews = res.reviews || [];
		}, error => {});
	}
	
	private _busy = false;
	private editMode = false;	
	
	public onSubmit() : void {	
		if (this.form.valid && !this._busy) {
			this._busy = true;

			this._userService.update(this.formModel).subscribe(data => {
				if (data.user) {
					this.user.about = data.user.about;
				}
				
				this._busy = false;
				this.editMode = false
			}, err => {
				this._busy = false;
				this.editMode = false
			});
		}
	}
}








