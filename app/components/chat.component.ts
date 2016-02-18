import {Component, Input, 
	DoCheck, 
	OnInit, 
	OnChanges, 
	OnDestroy, 
	AfterContentInit, 
	AfterContentChecked, 
	AfterViewInit, 
	AfterViewChecked,
	SimpleChange, /*NgZone, */Inject, Query, QueryList, ElementRef} from 'angular2/core';
	
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {MessageService} from '../services/message/message.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';

declare var window: any;

@Component({
	selector: 'chat',
	templateUrl: '/app/tmpls/chat.html',
	pipes: [ToDatePipe],
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent]
})

export class ChatComponent implements 
		/*DoCheck, 
		OnInit,
		OnChanges,
		OnDestroy, 
		AfterContentInit, 
		AfterContentChecked, */
		AfterViewInit, 
		AfterViewChecked
	{
	// @Input() orderId: string;
	public orderId: string;
	
	public messages: any[] = [];
	public order: any = {};//trip: {}, user: {}
	public lastMid: string;
	
	public formModel: any = {};
	public form: ControlGroup;
	
	public scrollHeight: number = 0;
	public maxHeight: any;
	
	public FORM_HEIGHT: number = 135;
	
	private _canScrollDown : boolean = false;
	// public static get FORM_HEIGHT():number { return 135; }
	
	// public $window = window;
	
	constructor (
		private messageService: MessageService,
		private fb: FormBuilder,
		// private el: ElementRef,
		// private zone: NgZone,
		private routeParams: RouteParams,
		@Inject('config.orderStatus') public configOrderStatus,
		@Inject('config.user') public configUser,
		public element: ElementRef
	) {
		// console.log(this.FORM_HEIGHT);
		this.form = fb.group({
			order: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.orderId = this.routeParams.get('id');
		
		this.getMessages();
		
		this.elChatList = this.element.nativeElement.querySelector('.chat-list');
		
		// this.onResize();
	}
	
	public scrollDown() {
		this.elChatList.scrollTop = this.elChatList.scrollHeight;
		console.log(this.elChatList.scrollHeight);
		// return this.elChatList.scrollHeight
	}
	
	public expand(): void {console.log(this.elChatList.scrollHeight);
		let windowHeight = window.innerHeight || window.document.documentElement.clientHeight || window.document.body.clientHeight;
		let listTop = this.elChatList.getBoundingClientRect().top;		
		let height = windowHeight - listTop - this.FORM_HEIGHT;
		
		this.elChatList.style.maxHeight = (height < 200 ? 200 : height) + 'px';	
	}
	
	public onResize(/*$event, list , $window*/): void {
		console.log('onResizeonResizeonResizeonResizeonResize');
		this.expand();
	}

	public ngAfterViewInit (): void {		
console.log('ngAfterViewInit');//this.getMessages();
		this.scrollDown();
	}
	
	
	public ngAfterViewChecked (): void {		
console.log('ngAfterViewChecked');//this.getMessages();
		if (this._canScrollDown) {
			this.scrollDown();
			this._canScrollDown = false;
		}
		
		this.expand()
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
	
	
	
	
	
	public getMessages(): void {
		this.formModel.order = this.orderId;
		
		this.messageService.getByOrderId(this.orderId)
			.subscribe(res => {			
				this.messages = res.messages;
				this.order = res.order;
				if (res.messages.length) {
					this.lastMid = res.messages[res.messages.length - 1]._id;				
				} else {
					this.lastMid = '';
				}
this._canScrollDown = true;
			}, error => {
				console.log(error);
			}, () => {
				console.log('done');				
			});
	}
	 
	public getLastMessages(): void {
		this.messageService.getLastMessages(this.lastMid)
			.subscribe(messages => {		
				// this.messages = messages;
				
				if (messages.length) {
					this.lastMid = messages[messages.length - 1]._id;				
				} else {
					this.lastMid = '';
				}
				
				messages.forEach(message => this.messages.push(message) );				
				console.dir(this.messages);
this._canScrollDown = true;
			}, error => {
				console.dir(error);
			}, () => {
				console.log('done')
			});
	}	
	
	public onSubmit(value:Object): void {
		if (this.form.valid) {
			this.messageService.add(this.formModel)			
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

























