import {Component, Inject, provide, Renderer, Injector} from 'angular2/core';	
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {UserCardComponent} from './user-card.component';
import {ChatComponent} from './chat.component';

@Component({
	selector: 'messages',
	templateUrl: '/client_src/tmpls/messages.html',
	pipes: [ToDatePipe],
	directives: [ROUTER_DIRECTIVES, ChatComponent, UserCardComponent]
})

export class MessagesComponent {
	public corrId : string;
	public isChatActual : boolean = false;

	public user : any = {};//trip: {}, user: {}	
	
	public error : string = '';	
	
	constructor (
		private _routeParams : RouteParams,
		@Inject('config.user') public configUser
	) {
		this.corrId = this._routeParams.get('id');
	}
	
	private _loaded : boolean = false;
	
	public onUser(user) : void {
		this._loaded = true;
		
		this.user = user;
	}
	
	public onChatError(err) : void {
		this._loaded = true;
		
		this.error = 'Unexpected error. Try again later.';

		try {
			this.error = err.json().error || this.error;
		} catch(e) {}
	}
}







	
/*	
	public ngOnInit(): void {	
console.log('ngOnInit');	
		//this.getMessages();
		ftrt
	}
		public ngDoCheck(): void {		
		console.log('ngDoCheck');//this.getMessages();
		this.expand();
		this.scrollDown();
		// this.scrollHeight = this.elChatList.scrollHeight;
	}
	
	
	public ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
console.log('ngOnChanges');
		// Empty the changeLog whenever counter goes to zero
		// hint: this is a way to respond programmatically to external value changes.
		// if (this.counter === 0) {
			// this.changeLog.length = 0;
		// }

		A change to `counter` is the only change we care about
		// let prop = changes['counter'];
		// let cur = prop.currentValue;
		// let prev = JSON.stringify(prop.previousValue); // first time is {}; after is integer
		// this.changeLog.push(`counter: currentValue = ${cur}, previousValue = ${prev}`);
		
		//this.getMessages();
		
	}
	
	
	public ngAfterContentInit(): void {		
console.log('ngAfterContentInit');//this.getMessages();
	}
	
	
	public ngAfterContentChecked (): void {		
console.log('ngAfterContentChecked');//this.getMessages();
	}
	
	

	
	
	public ngOnDestroy (): void {		
console.log('ngOnDestroy');
	}
	
*/
	









	// import {Component, AfterViewChecked, ElementRef} from 'angular2/core';

	// @Component({
		// selector: 'chat',
		// template: `
			// <div style="max-height:200px; overflow-y:auto;" class="chat-list">
				// <ul>
					// <li *ngFor="#message of messages;">
						// {{ message }}
					// </li>
				// </ul>
			// </div>
			// <textarea #txt></textarea>
			// <button (click)="messages.push(txt.value); txt.value = '';">Send</button>
		// `
	// })

	// export class ChatComponent implements AfterViewChecked {
		// public messages: any[] = [];		
		// private _prevChatHeight: number = 0;
		
		// constructor (public element: ElementRef) {
			// this.messages = ['message 3', 'message 2', 'message 1'];
			
			// this.elChatList = this.element.nativeElement.querySelector('.chat-list');
		// }		
		
		// public ngAfterViewChecked(): void {
			// /* need _canScrollDown because it triggers even if you enter text in the textarea */

			// if ( this._canScrollDown() ) {
				// this.scrollDown();
			// }		
		// }		
		
		// private _canScrollDown(): boolean {
			// /* compares prev and current scrollHeight */

			// var can = (this._prevChatHeight !== this.elChatList.scrollHeight);

			// this._prevChatHeight = this.elChatList.scrollHeight;
			
			// return can;
		// }
		
		// public scrollDown(): void {
			// this.elChatList.scrollTop = this.elChatList.scrollHeight;
		// }
	// }