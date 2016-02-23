import {Component, ElementRef, Injector, Inject, provide, Renderer} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {TripCardComponent} from './trip-card.component';

import {Trip} from '../services/trip/trip';
import {TripService} from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';

import {GmAutocompliteComponent} from './gm-autocomplite.component';
import {RequestAddComponent} from './request-add.component';

import {ToDatePipe} from '../pipes/to-date.pipe';

// import {Router} from 'angular2/router';

@Component({
	templateUrl: '/app/tmpls/trips.html',
	directives: [GmAutocompliteComponent, ROUTER_DIRECTIVES, TripCardComponent],
	pipes: [ToDatePipe]
})

export class TripsComponent {
	public trips: Trip[];
	
	// public trips: any[];
	
	public searchModel: any = {
		from: "Montreal, QC, Canada",
		from_id: "ChIJDbdkHFQayUwR7-8fITgxTmU"		
	};
	
	public searchForm: ControlGroup;

	constructor(
		// private _router: Router,
		private _fb: FormBuilder,
		private _tripService: TripService,
		private _orderService: OrderService,
		private _modalService: ModalService,
		private _renderer: Renderer,
		private routeParams: RouteParams,
		@Inject('config.user') public configUser
	) {
		this.searchModel = {
			from: this.routeParams.get('from') ? decodeURIComponent( this.routeParams.get('from') ) : this.searchModel.from,
			from_id: this.routeParams.get('from_id') || this.searchModel.from_id,
			to: this.routeParams.get('to') ? decodeURIComponent( this.routeParams.get('to') ) : this.searchModel.to,
			to_id: this.routeParams.get('to_id') || this.searchModel.to_id
		}

		this.searchForm = _fb.group({
			from: '', //['', Validators.required],
			from_id: '', //['', Validators.required],
			to: '', //['', Validators.required],
			to_id: '' //['', Validators.required]
		});
	}

	onSubmit(value:Object):void {
		if (this.searchForm.valid) {
			this._tripService.search(this.searchModel)
				.subscribe(res => {
					this.trips = res.json();
					
					/* let trips = res.json();

					this.trips = trips.map(trip => {
						trip.when = new Date(trip.when);

						return trip;
					}); */

					// console.dir( this.trips );
				}, err => {
					// console.dir(err)
				}, () => {
					// console.log('done')
				});


			/* .subscribe(
				res => res.text(), 						// success
				err => console.dir(err),				// error
				() => console.log('done')
			);

			.subscribe(trips => {
				console.dir(trips);
				this.trips = trips;
			});*/
		}
	}

	onRequest(trip:Trip):void {
		this._modalService.open().then(modalComponentRef => {
		
			// let tripProvider = Injector.resolve([provide(Trip, {useValue: trip})]);			
			// var tripProvider = Injector.resolve([bind(Trip).toValue(trip)]);			
			
			var otherResolved = Injector.resolve([
				provide(Renderer, {useValue: this._renderer}),
				provide(OrderService, {useValue: this._orderService}),
				provide('trip', {useValue: trip})
			]);
			
			this._modalService.bind(RequestAddComponent, modalComponentRef, otherResolved).then(componentRef => {
				
				// let component: RequestAddComponent = componentRef.instance;
				// component.ref = componentRef;
				
				// res.instance.formModel.trip_id = trip._id;
				
				// console.log(33333333333333333333333333333333);
				// console.log(res.instance.formModel.trip_id);
				// console.log(trip._id);
			});
		});
	}
}

// Request, RequestMethod,







