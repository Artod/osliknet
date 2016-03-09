import {Component, ElementRef, Injector, Inject, provide, ApplicationRef/*, Renderer*/} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams, Router, Location} from 'angular2/router';

import {TripService}  from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {SubscribeService} from '../services/subscribe/subscribe.service';
import {ModalService} from '../services/modal/modal.service';

import {CaptchaComponent} from './captcha.component';
import {TripCardComponent} from './trip-card.component';
import {GmAutocompliteComponent} from './gm-autocomplite.component';
import {OrderAddComponent} from './order-add.component';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/trips.html',
	directives: [GmAutocompliteComponent, ROUTER_DIRECTIVES, TripCardComponent, CaptchaComponent],
	pipes: [ToDatePipe]
})

export class TripsComponent {
	public trips : any[] = [];
	public subscribe : any = {};	
	
	// public trips: any[];
	
	public searchModel : any = {};
	public searchForm : ControlGroup;
	
	public subModel : any = {};
	public subForm : ControlGroup;
	
		/*from: "Montreal, QC, Canada",
		from_id: "ChIJDbdkHFQayUwR7-8fITgxTmU"	*/
	public sitekey : string;	

	constructor(
		private _router: Router,
		private _location: Location,
		// private _renderer : Renderer,
		private _modalService : ModalService,
		private _orderService : OrderService,
		private _tripService : TripService,
		private _subscribeService : SubscribeService,
		private _fb : FormBuilder,
		private _routeParams : RouteParams,
		private _appRef : ApplicationRef,
		@Inject('config.user') public configUser
	) {
		this.searchForm = this._fb.group({
			from: '', //['', Validators.required],
			from_id: '', //['', Validators.required],
			to: '', //['', Validators.required],
			to_id: '' //['', Validators.required]
		});
		
		this.subModel = {
			email: '',
			recaptcha: ''
		}
		
		this.subForm = this._fb.group({
		email: configUser.id ? '' : ['', Validators.compose([(ctrl) => {
					if (!/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value) ) {
						return {invalidEmail: true}
					}
					
					return null;
				},
				Validators.required]
			)],
			recaptcha: configUser.id ? '' : ['', Validators.required]
		});
		
		this.init();
		
		this._location.subscribe(() => {
			this.init();
		});
		
	}
	
	public init() {
		this.searchModel = {
			from: this._routeParams.get('from') ? decodeURIComponent( this._routeParams.get('from') ) : this.searchModel.from,
			from_id: this._routeParams.get('from_id') || this.searchModel.from_id,
			to: this._routeParams.get('to') ? decodeURIComponent( this._routeParams.get('to') ) : this.searchModel.to,
			to_id: this._routeParams.get('to_id') || this.searchModel.to_id
		}
		
		this.search();
	}
	
	public serialize(obj) : string {
		return '?' + Object.keys(obj).reduce(function(a,k){if(obj[k])a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&');
	}

	public lastId : string = '';
	public limit : number = 2;
	private _busy : boolean = false;

	public loadNext() : void {
		this._busy = true;
		
		let queryId = this.serialize(this.searchModel) + this.lastId;
		
		this._tripService.search(this.searchModel, this.limit, this.lastId).subscribe(data => {
			if ( queryId !== (this.serialize(this.searchModel) + this.lastId) ) {
				return;
			}

			(data.trips || []).forEach( (trip) => {
				this.trips.push(trip);
			});
			
			this.subscribe = data.subscribe || {};
			
			this.lastId = (data.trips[this.limit - 1] || {})._id || '';

			// this.isSearch = false;
			this._busy = false;
		}, err => {
			this._busy = false;
		});
	}
	
	private _inited : boolean = false;
	
	public onSubmit($event, $form, $thanx) : void {

		
		//setTimeout( ()=> this.search($event, $form, $thanx), 1 );
		
		this.search($event, $form, $thanx)
	}
	
	public search($event, $form, $thanx) : void {
		if (!this.searchForm.valid) {			
			return false;
		}
		
		if (!this.searchModel.from_id) {
			this.searchModel.from = '';
		}
		
		if (!this.searchModel.to_id) {
			this.searchModel.to = '';
		}

		if ($event) {
			this._location.go('/trips', this.serialize({
				from: this.searchModel.from,
				from_id: this.searchModel.from_id,
				to: this.searchModel.to,
				to_id: this.searchModel.to_id
			}));				
		}
		
		if (this.subModel.from_id !== this.searchModel.from_id || this.subModel.to_id !== this.searchModel.to_id) {
			this._subsFinished = false;
		}
		
		this.subModel.from = this.searchModel.from;
		this.subModel.from_id = this.searchModel.from_id;
		this.subModel.to = this.searchModel.to;
		this.subModel.to_id = this.searchModel.to_id;
		
		if (!this.searchModel.from_id && !this.searchModel.to_id) {
			this.trips = [];
			this.subscribe = {};
			this.lastId = '';
			
			return;
		}
		
		this._tripService.search(this.searchModel, this.limit).subscribe(data => {
			this.trips = data.trips || [];
			this.lastId = (data.trips[this.limit - 1] || {})._id || '';
			this.subscribe = data.subscribe || {};
			
			this._inited = true;
		}, err => {
			this._inited = true;
		});
	}

	private _subBusy : boolean = false;
	private _subsFinished : boolean = false;
	private _subSubmitted : boolean = false;
	
	public onSubscribe($event, $form) : void {
		let $email = $form.querySelector('input[type="email"]');

		// if (this.subForm.controls.email.errors.required) {
		// if (!this.subForm.controls.email.valid) {
		if ($email && $email.value === '') {
			$email.focus();
			
			return false;
		}
		
		this._subSubmitted = true;
		
		if (!this.subForm.valid) {
			return false;
		}
		
		this._subBusy = true;
		
		this._subscribeService.add(this.subModel).subscribe(data => {
			// $form.style.display = 'none';
			// $thanx.style.display = 'inherit';
			this._subsFinished = true;
			this._subSubmitted = false;
			this._subBusy = false;
			
			this._appRef.tick();
		}, err => {

			this._subBusy = false;
		});
	}
	
	
	/*public onCaptcha(response) : void {
		this.subModel.recaptcha = response;
	}*/
	
	public onRequest(trip) : void {
		this._modalService.show(OrderAddComponent, Injector.resolve([
			provide(OrderService, {useValue: this._orderService}),
			provide(Router, {useValue: this._router}),
			provide(Location, {useValue: this._location}),
			provide('trip', {useValue: trip})
		]));
	}
	
	public unsubscribe($link) : void {
		this._subscribeService.cancel(this.subscribe._id).subscribe(data => {
			$link.innerHTML = '<i>You have successfully unsubscribed!</i>';
			this._subsFinished = false;
		}, err => {
			$link.innerHTML = '<i>Something went wrong. Try again later.</i>';
		});
		
		return false;
	}
}

// Request, RequestMethod,








