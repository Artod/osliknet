import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers} from 'angular2/http';

@Injectable()

export class UserService {
	constructor(public http : Http) { }
	
	public getById(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/users/' + (id || 'my') + '?xhr', {
			headers: headers
		}).map(res => <any[]> res.json());
	}
	
	public update(data) {		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		return this.http.post('/users/update?xhr', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public login(data) {		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		return this.http.post('/users/login?xhr', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public signup(data) {		
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
		
		return this.http.post('/users/signup?xhr', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
}

/* 
declare var window: any;

export function user() {
	return window.user;
}

export function isLoggedIn() {
	return !!(window.user && window.user.id);
} */

