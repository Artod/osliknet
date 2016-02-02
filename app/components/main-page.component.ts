import {Component, ElementRef, Injector, provide, Renderer} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {GmAutocompliteComponent} from '../components/gm-autocomplite.component';

import {Trip} from '../services/trip/trip';
import {TripService} from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';
import {RequestAddComponent} from './request-add.component';


// import {Router} from 'angular2/router';

@Component({
	templateUrl: '/app/tmpls/main-page.html',
	directives: [GmAutocompliteComponent]
})

export class MainPageComponent {
	public trips: Trip[];
	// public trips: any[];
	public searchModel = {
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
		private _renderer: Renderer
		
	) {		
		this.searchForm = _fb.group({
			from: '', //['', Validators.required],
			from_id: '', //['', Validators.required],
			to: '', //['', Validators.required],
			to_id: '' //['', Validators.required]
		});
	}

	onSubmit(value:Object):void {
		// console.dir(value)

		// console.dir(this.searchModel);

		if (this.searchForm.valid) {
			this._tripService.search(this.searchModel)
				.subscribe(res => {
					let trips = res.json();

					this.trips = trips.map(trip => {
						trip.when = new Date(trip.when);

						return trip;
					});

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








