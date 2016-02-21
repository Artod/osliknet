import {Injectable, Inject} from 'angular2/core';
import {Http, URLSearchParams, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()

export class NotificationService {
	private _headers: Headers;
	
	public notif:any = {
		newMessages:{},
		newOrders:[]
	}

	public updated: number;
	
	public subject: Subject;
	
	private _pollSub: Observable;
	
	private _timeout: number = 5000;
	 
	constructor(
		private _http:Http,
		@Inject('config.user') public configUser
	) {
		/*var that = this;
			
		setInterval(function() {
			that.getNotification();
		}, 2000);*/
		
		this._headers = new Headers();
		this._headers.append('X-Requested-With', 'XMLHttpRequest');
		
		this.subject = new Subject();
	}
	
	/*
	public subscribe(cb:Function) {
		this.subject.subscribe(res => {
			var notifTimestamp = ( new Date(res.updated_at) ).getTime();
			if (notifTimestamp != this.updated ) {
				this.notif = res;
			}			
		});
	}*/
	
	public changeTimeout(timeout? : number) {
		this.stop();
		this.start(timeout || this._timeout);
	}

	public start(timeout? : number) {
		this.stop();
		
		this._pollSub = Observable.timer(0, timeout || this._timeout).switchMap(() => {
			return this._http.get('/users/notifications', {
				headers: this._headers
			});
		}).map( res => res.json() ).catch(this._handleError).subscribe(res => {
			var notifTimestamp = ( new Date(res.updated_at) ).getTime();

			if (notifTimestamp !== this.updated ) {
				this.updated = notifTimestamp;
				this.notif = res;
				
				this.subject.next(this.notif);
			}			
		});
		
		return this.subject;
	}
	
	public stop() {
		if (this._pollSub) {
			this._pollSub.unsubscribe();
		}
	}
	
	/*public getNotification() {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		this.http.get('/users/notifications', {
			headers: headers
		}).map( res => res.json() ).catch(this._handleError).subscribe(res => {		
			this.notif = res;
		}, error => {
			console.log(error);
		}, () => {
			console.log('done');				
		});
	}*/
	
	private _handleError(error: Response) {
console.error('Observable error notif');
		return Observable.throw(error.json().error || 'Server error');
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