import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers} from 'angular2/http';

@Injectable()

export class UserService {
	constructor(public http:Http) { }
	
	public getById(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/users/' + id, {
			headers: headers
		}).map(res => <any[]> res.json());
	}
	
	public update(data) {		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
	
		return this.http.post('/users/update', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
}