import {Injectable, Inject} from 'angular2/core';
import {Http, URLSearchParams, Headers, Response} from 'angular2/http';
import {Observable} from 'rxjs/Observable';

@Injectable()

export class NotificationService {
	public notif: any;
	 
	constructor(
		public http:Http,
		@Inject('config.user') public configUser
	) {
console.log('constructor NotificationService')
		var that = this;

			
		setInterval(function() {
			that.getNotification();
		}, 2000);
	}	 
	
	public getNotification() {	
console.log('getNotificationfff ')
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		this.http.get('/users/notifications', {
			headers: headers
		}).map( res => res.json() ).catch(this._handleError).subscribe(res => {		
			this.notif = res;
console.log('notifnotifnotifnotifnotifnotifnotifnotifnotif ')
console.dir(this.notif)
		}, error => {
			console.log(error);
		}, () => {
			console.log('done');				
		});
	}
	
	private _handleError (error: Response) {
console.error('Observable');
		console.error(error);
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