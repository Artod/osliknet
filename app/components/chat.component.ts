import {Component, Input, Directive, 
	AfterViewChecked,
	/*DoCheck, 
	OnInit, 
	OnChanges, 
	OnDestroy, 
	AfterContentInit, 
	AfterContentChecked, 
	AfterViewInit, 
	SimpleChange, */Inject, Query, QueryList, ElementRef} from 'angular2/core';
	
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {MessageService} from '../services/message/message.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';

declare var window: any;








/*
@Directive({
  selector: '[postRender]'
})

export class PostRenderDirective {
	constructor() {
		
		console.log('constructor')
	}
	
	@Input() set postRender(cb) {
		//cb();
console.log('setpostRender')
	}
}
*/







@Component({
	selector: 'chat',
	templateUrl: '/app/tmpls/chat.html',
	pipes: [ToDatePipe],
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent/*, PostRenderDirective*/]
})

export class ChatComponent implements
	AfterViewChecked/*,
	AfterViewInit
	DoCheck, 
	OnInit,
	OnChanges,
	OnDestroy, 
	AfterContentInit, 
	AfterContentChecked,		
	*/
{
	public orderId: string;
	
	public messages: any[] = [];
	public order: any = {};//trip: {}, user: {}
	public lastId: string = '0';
	
	public formModel: any = {};
	public form: ControlGroup;
	
	private _prevChatHeight: number = 0;
	public FORM_HEIGHT: number = 135;
	
	constructor (
		private _messageService: MessageService,
		private _fb: FormBuilder,
		private _el: ElementRef,
		// private zone: NgZone,
		private _routeParams: RouteParams,
		@Inject('config.orderStatus') public configOrderStatus,
		@Inject('config.user') public configUser
	) {
		// console.log(this.FORM_HEIGHT);
		this.form = _fb.group({
			order: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.orderId = this._routeParams.get('id');
		
		this.getMessages();
		
		this.elChatList = this._el.nativeElement.querySelector('.chat-list');
		
		// this.onResize();
	}
	
	private _canScrollDown(): boolean {
		var can = (this._prevChatHeight !== this.elChatList.scrollHeight);

		this._prevChatHeight = this.elChatList.scrollHeight;
		
		return can;
	}
	
	public scrollDown(): void {
		this.elChatList.scrollTop = this.elChatList.scrollHeight;
	}
	
	public expand(): void {
console.log('expand');
		let windowHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
		let listTop = this.elChatList.getBoundingClientRect().top;		
		let height = windowHeight - listTop - this.FORM_HEIGHT;
		
		this.elChatList.style.maxHeight = (height < 200 ? 200 : height) + 'px';	
	}
	
	public onResize(): void {
		this.expand();
	}
/*
	public ngAfterViewInit(): void {
		this.scrollDown();
	}
	*/
	
	public ngAfterViewChecked(): void {
		if ( this._canScrollDown() ) {
			this.scrollDown();
			this.expand()
		}		
	}
	

	
	public getMessages(): void {
		this.formModel.order = this.orderId;
		
		this._messageService.getByOrderId(this.orderId)
			.subscribe(res => {			
				this.messages = res.messages;
				this.order = res.order;
				if (res.messages.length) {
					this.lastId = res.messages[res.messages.length - 1]._id;				
				} else {
					this.lastId = '0';
				}
// this._canScrollDown = true;
			}, error => {
				console.log(error);
			}, () => {
				console.log('done');				
			});
	}
	 
	public getLastMessages(): void {
		this._messageService.getLastMessages(this.orderId, this.lastId)
			.subscribe(messages => {		
				// this.messages = messages;
				
				if (messages.length) {
					this.lastId = messages[messages.length - 1]._id;				
				} else {
					this.lastId = '0';
				}
				
				messages.forEach(message => this.messages.push(message) );				

// this._canScrollDown = true;
			}, error => {
				console.dir(error);
			}, () => {
				console.log('done')
			});
	}	
	
	public onSubmit(value:Object): void {
		if (this.form.valid) {
			this._messageService.add(this.formModel)			
				.subscribe(message => {
					
					this.getLastMessages();
				}, err => {
					console.dir(err);
				}, () => {
					console.log('done')
				});
		}
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