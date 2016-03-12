import {Component, Inject} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {UserService} from '../services/user/user.service';
import {ReviewService}  from '../services/review/review.service';

import {UserCardComponent} from './user-card.component';
import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/client_src/tmpls/user.html',
	directives: [ROUTER_DIRECTIVES, UserCardComponent],
	pipes: [ToDatePipe]
})

export class UserComponent {
	public uid : string = '';
	
	public user : any = {};
	public reviews : any[] = [];
	
	public formModel : any = {};
	public form : ControlGroup;
	
	private _ratings : Array = [1, 2, 3, 4, 5];
	
	public tRating : [] = [0, 0];
	public rRating : [] = [0, 0];
	
	private _inited : boolean = false;

	constructor(
		private _fb : FormBuilder,
		private _userService : UserService,
		private _reviewService : ReviewService,
		private _routeParams : RouteParams,
		@Inject('config.user') public configUser
	) {
		this.uid = this._routeParams.get('id') || '';
		
		this.form = this._fb.group({ 
			about: ''//['', Validators.required]
		});		
		
		this._userService.getById(this.uid).subscribe(res => {			
			this.user = res.user || {};
			
			this.user && ( this.formModel.about = (this.user.about || '') );

			if (this.user && this.user.stats) {
				this.tRating = this._reviewService.calculateRating(this.user.stats.t_rate);
				this.rRating = this._reviewService.calculateRating(this.user.stats.r_rate);
			}
			
			// this._inited = true;
		}, error => {
			// this._inited = true;
		});
		
		this.loadNext();
		

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
	
	public page : number = 0;
	public limit : number = 2;
	public fullPage : boolean = false;
	private _busyPaging : boolean = false;

	public loadNext() : void {	
		this._busyPaging = true;
		
		this._reviewService.get(this.limit, this.page).subscribe(data => {
			(data.reviews || []).forEach( (review) => {
				this.reviews.push(review);
			} );
			
			if ( (data.reviews || [])[this.limit - 1] ) {
				this.page++;
			} else {
				this.fullPage = true;
			}
			
			this._busyPaging = false;
			this._inited = true;
		}, error => {
			
			this._busyPaging = false;
			this._inited = true;
		});
	}
}








