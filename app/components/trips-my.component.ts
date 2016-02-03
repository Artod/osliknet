import {Component} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';

@Component({
	templateUrl: '/app/tmpls/trips-my.html',
	directives: [ROUTER_DIRECTIVES]
})

export class TripsMyComponent {
	public trips: any[];

	constructor(
		private tripService: TripService
	) {
		this.tripService.getMy()
			.subscribe(trips => {
				this.trips = trips.map(trip => {
					trip.when = new Date(trip.when);

					return trip;
				});

			}, error => {
				console.dir(error);
			}, () => {
				console.log('done');
			});
	}
}

/*.subscribe(
                       heroes => this.heroes = heroes,
                       error =>  this.errorMessage = <any>error);
}*/








