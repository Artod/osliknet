import {Component, ElementRef, Injector, Inject, provide/*, Renderer*/} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams, Router, Location} from 'angular2/router';


import {TripService} from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';

import {TripCardComponent} from './trip-card.component';
import {GmAutocompliteComponent} from './gm-autocomplite.component';
import {OrderAddComponent} from './order-add.component';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/trips.html',
	directives: [GmAutocompliteComponent, ROUTER_DIRECTIVES, TripCardComponent],
	pipes: [ToDatePipe]
})

export class TripsComponent {
	public trips : any[];
	
	// public trips: any[];
	
	public searchModel : any = {

	};
		/*from: "Montreal, QC, Canada",
		from_id: "ChIJDbdkHFQayUwR7-8fITgxTmU"	*/		
	public searchForm : ControlGroup;

	constructor(
		private _router: Router,
		private _location: Location,
		// private _renderer : Renderer,
		private _modalService : ModalService,
		private _orderService : OrderService,
		private _tripService : TripService,
		private _fb : FormBuilder,
		private _routeParams : RouteParams,
		@Inject('config.user') public configUser
	) {
		this.searchForm = this._fb.group({
			from: '', //['', Validators.required],
			from_id: '', //['', Validators.required],
			to: '', //['', Validators.required],
			to_id: '' //['', Validators.required]
		});
		
		this.init();
		
		this._location.subscribe(() => {
			this.init();
		});
	}
	
	public init() {

console.log('this._routeParams.get(from_id) = ',this._routeParams.get('from_id'));
		this.searchModel = {
			from: this._routeParams.get('from') ? decodeURIComponent( this._routeParams.get('from') ) : this.searchModel.from,
			from_id: this._routeParams.get('from_id') || this.searchModel.from_id,
			to: this._routeParams.get('to') ? decodeURIComponent( this._routeParams.get('to') ) : this.searchModel.to,
			to_id: this._routeParams.get('to_id') || this.searchModel.to_id
		}
		
		this.onSubmit();		
	}
	
	public serialize(obj) {
		return '?' + Object.keys(obj).reduce(function(a,k){if(obj[k])a.push(k+'='+encodeURIComponent(obj[k]));return a},[]).join('&');
	}
	
	public onSubmit($event) : void {
		if (this.searchForm.valid) {			
			if ($event) {
				this._location.go('/trips', this.serialize({
					from: this.searchModel.from,
					from_id: this.searchModel.from_id,
					to: this.searchModel.to,
					to_id: this.searchModel.to_id
				}));				
			}
			
			this._tripService.search(this.searchModel).subscribe(data => {
				this.trips = data.trips || [];				
			}, err => {
				console.dir(err)
			});
		}
	}

	public onRequest(trip) : void {
		this._modalService.open().then(modalComponentRef => {
		
			// let tripProvider = Injector.resolve([provide(Trip, {useValue: trip})]);			
			// var tripProvider = Injector.resolve([bind(Trip).toValue(trip)]);			
			
			var otherResolved = Injector.resolve([
				// provide(Renderer, {useValue: this._renderer}),
				provide(OrderService, {useValue: this._orderService}),
				provide(Router, {useValue: this._router}),
				provide(Location, {useValue: this._location}),
				provide('trip', {useValue: trip})
			]);
			
			this._modalService.bind(OrderAddComponent, modalComponentRef, otherResolved).then(componentRef => {				
				// let component: RequestAddComponent = componentRef.instance;
				// component.ref = componentRef;				
				// res.instance.formModel.trip_id = trip._id;
				
				// modalComponentRef.instance.show();
			});
		});
	}
}

// Request, RequestMethod,








