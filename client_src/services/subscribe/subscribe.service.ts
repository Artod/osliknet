import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers} from 'angular2/http';

@Injectable()

export class SubscribeService {
	constructor(public http:Http) { }

	public add(data) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/subscribes/add?xhr', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public cancel(id) {
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/subscribes/cancel/' + id + '?xhr', {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	
	
/*
	public getByOrderId(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/reviews/order/' + id, {
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public get(limit, page) {		
		let search : URLSearchParams = new URLSearchParams();
		
		if (limit)
			search.set('limit', limit);	
		
		if (page)
			search.set('page', page);
		
		return this.http.get('/reviews', {
			search: search
		}).map( res => <any[]> res.json() );
	}
*/

}