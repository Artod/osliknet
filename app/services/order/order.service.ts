import {Injectable} from 'angular2/core';
// import {HTTP_PROVIDERS, Http, Request, RequestMethod} from 'angular2/http';
import {Http, URLSearchParams, Headers} from 'angular2/http';
// import {Trip} from './trip';

// import {HEROES} from './mock-heroes';
// import {Http, HTTP_PROVIDERS} from 'angular2/http';
// import {Http, Headers} from 'angular2/http';

@Injectable()

export class OrderService {
	constructor(public http:Http) {
		console.log('constructor');
		
	}

	getOrders(data) {
		let search: URLSearchParams = new URLSearchParams();
		
/*
		if (data.from_id)
			search.set('from_id', data.from_id);
		
		if (data.to_id)
			search.set('to_id', data.to_id);
*/
		
		Object.keys(data).forEach(function (key) {
			search.set(key, data[key]);
		});

		return this.http.get('/orders', {
			search: search			
		});
	}
	
	add(data) {		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
	
		return this.http.post('/orders/add', JSON.stringify(data), {			
			headers: headers
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