import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

@Injectable()

export class TripService {
	constructor(public http:Http) { }
	
	public search(data) {
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		let search: URLSearchParams = new URLSearchParams();
		
		if (data.from_id)
			search.set('from_id', data.from_id);
		
		if (data.to_id)
			search.set('to_id', data.to_id);

		return this.http.get('/trips', {
			headers: headers,
			search: search			
		}).map( res => <any[]> res.json() );
	}

	public getMy() {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/trips/my', {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public getById(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/trips/' + id, {
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	/*
	public getOrder(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/orders/' + id, {
			headers: headers
		}).map( res => <any[]> res.json() );
	}*/
	
	public addTrips(data) {
		/*let search: URLSearchParams = new URLSearchParams();

		search.set('from_id', data.from_id);
		search.set('to_id', data.to_id);*/
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/trips/add', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public update(data) {		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
	
		return this.http.post('/trips/update', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
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