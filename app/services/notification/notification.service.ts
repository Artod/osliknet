import {Injectable} from 'angular2/core';
import {Http, URLSearchParams, Headers} from 'angular2/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()

export class NotificationService {
	private _headers: Headers;	
	public data : any = {
		newMessages:{},
		newOrders:[]
	}
	public updated : number = 0;	
	public subject : Subject;	
	private _pollSub : Observable;	
	private _defaultTimeout : number = 10000;
	public currentTimeout : number;
	 
	constructor(
		private _http:Http
	) {	
		this._headers = new Headers();
		this._headers.append('X-Requested-With', 'XMLHttpRequest');
		
		this.subject = new Subject();
	}
	
	public changeTimeout(timeout? : number) {
		this.start(timeout);
	}

	public start(timeout? : number) {		
		timeout = timeout || this._defaultTimeout;
		
		if (timeout === this.currentTimeout && this._pollSub && !this._pollSub.isUnsubscribed) {
			return this.subject;
		}
		
		this.currentTimeout = timeout;
		
		this.stop();
		
		this._pollSub = Observable.timer(0, this.currentTimeout).switchMap( () => {
			return this._http.get('/users/notifications/' + this.updated, {
				headers: this._headers
			});
		} ).map( res => res.json() ).catch(this._handleError).subscribe(res => {
			var serverUpdated = new Date(res.updated_at).getTime();
			
			if (serverUpdated !== this.updated) {
console.log('!==!==!==!==!==!==!==!==!==!==!==!==!==!==!==!==!==!==!==');
				this.updated = serverUpdated;
				this.data = res;
				
				this.subject.next(this.data);
			}			
		});
		
		return this.subject;
	}
	
	public stop() {
		if (this._pollSub && !this._pollSub.isUnsubscribed) {
			this._pollSub.unsubscribe();
		}
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