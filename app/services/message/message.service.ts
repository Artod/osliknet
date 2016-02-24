import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

@Injectable()

export class MessageService {
	constructor(public http:Http) { }
	
	public getByOrderId(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/messages/order/' + id, {
			headers: headers
		}).map(res => <any[]> res.json());
	}
	 
	public getLastMessages(orderId, lastId) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');

		return this.http.get('/messages/last/' + orderId + '/' + lastId, {
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	
	public add(data) {
		/*let search: URLSearchParams = new URLSearchParams();

		search.set('from_id', data.from_id);
		search.set('to_id', data.to_id);*/
		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/messages/add', JSON.stringify(data), {			
			headers: headers
		}).map(res => <any[]> res.json().message);
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