import {Component, ElementRef} from 'angular2/core';
import {FORM_DIRECTIVES, CORE_DIRECTIVES, FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {GmAutocompliteComponent} from '../components/gm-autocomplite.component';

import {Trip} from '../services/trip/trip';
import {TripService} from '../services/trip/trip.service';

// import {Router} from 'angular2/router';

@Component({
	templateUrl: '/app/tmpls/main-page.html',
	directives: [GmAutocompliteComponent, FORM_DIRECTIVES, CORE_DIRECTIVES]	
})

export class MainPageComponent {
	public trips: Trip[];
	// public trips: any[];
	public searchModel = {};	
	public searchForm: ControlGroup;

	constructor(
	// private _router: Router,	
		private _fb: FormBuilder,
		private _tripService: TripService
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

		console.dir(this.searchModel);
	
		if (this.searchForm.valid) {
			this._tripService.getTrips(this.searchModel)			
				.subscribe(res => {
					let trips = res.json();
					
					this.trips = trips.map(trip => {
						trip.when = new Date(trip.when);
						
						return trip;
					});
					
					// console.dir( this.trips );
				}, err => {
					console.dir(err)
				}, () => {
					console.log('done')
				});
			
			
	/*		.subscribe(
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
}

// Request, RequestMethod, 