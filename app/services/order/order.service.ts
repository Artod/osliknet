import {Injectable} from 'angular2/core';
// import {HTTP_PROVIDERS, Http, Request, RequestMethod} from 'angular2/http';
import {Http, URLSearchParams, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

@Injectable()

export class OrderService {
	constructor(public http:Http) {
		console.log('OrderService constructor');
	}
	
	public get() {
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		return this.http.get('/orders', {
			headers: headers
		// }).map(res => <Order[]> res.json().orders)
		}).map( res => <any> res.json() );
	}
	
	public getByTripId(tripId) {
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		return this.http.get('/orders/trip/' + tripId, {
			headers: headers
		// }).map(res => <Order[]> res.json().orders)
		}).map( res => <any> res.json() );
	}
/*
	public getMy() {
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		return this.http.get('/orders/my', {			
			headers: headers
		// }).map(res => <Order[]> res.json().orders)
		}).map( res => <any[]> res.json() );
	}*/
	
	public add(data) {		
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
		headers.append('Content-Type', 'application/json');
	
		return this.http.post('/orders/add', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any> res.json() );
	}
	
	public changeStatus(status, order) {		
		let headers = new Headers();		
		headers.append('X-Requested-With', 'XMLHttpRequest');
		headers.append('Content-Type', 'application/json');

		let data = {
			status: status,
			order: order
		};
	
		return this.http.post('/orders/status', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any> res.json() );
	}

}

	/*private handleError (error: Response) {
		// in a real world app, we may send the server to some remote logging infrastructure
		// instead of just logging it to the console
		console.error(error);
		return Observable.throw(error.json().error || 'Server error');
	}*/
/*
	public getMy() {
		return this.http.get('/orders/my')
			.map(res => <Order[]> res.json().orders)
			.catch(this.handleError);
	}
*/


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
		
		
		
		
/*
		

		if (data.from_id)
			search.set('from_id', data.from_id);
		
		if (data.to_id)
			search.set('to_id', data.to_id);

		
		Object.keys(data).forEach(function (key) {
			search.set(key, data[key]);
		});

		return this.http.get('/orders', {
			search: search			
		});
*/
		
		
		
		
		
		
		