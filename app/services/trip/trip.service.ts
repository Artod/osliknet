import {Injectable} from 'angular2/core';
// import {HTTP_PROVIDERS, Http, Request, RequestMethod} from 'angular2/http';
import {Http, URLSearchParams} from 'angular2/http';
// import {Trip} from './trip';

// import {HEROES} from './mock-heroes';
// import {Http, HTTP_PROVIDERS} from 'angular2/http';
// import {Http, Headers} from 'angular2/http';

@Injectable()

export class TripService {
	constructor(public http:Http) { }

	getTrips(data) {
		let search: URLSearchParams = new URLSearchParams();
		
		search.set('from_id', data.from_id);
		search.set('to_id', data.to_id);

		return this.http.get('/trips', {
			search: search			
		});
	}	

}


	/**/

		/*return this.http.request(new Request({
			method: RequestMethod.Get,
			url: url,
			search: 'password=123'
		}));*/
		
		// Call map on the response observable to get the parsed people object
		// .map(res => res.json())
		// Subscribe to the observable to get the parsed people object and attach it to the
		// component
		// .subscribe(people => this.people = people);
	
		/* return new Promise<Trip[]>(resolve =>
			resolve(res)
		); */