import {Component, Input, OnInit, OnChanges, SimpleChange, /*ElementRef, NgZone, */Inject} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';

import {MessageService} from '../services/message/message.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';

@Component({
	selector: 'chat',
	templateUrl: '/app/tmpls/chat.html',
	pipes: [ToDatePipe],
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent]
})

export class ChatComponent implements OnInit, OnChanges {
	// @Input() orderId: string;
	public orderId: string;
	
	public messages: any[] = [];
	public order: any = {};//trip: {}, user: {}
	public lastMid: string;
	
	public formModel = {};
	public form: ControlGroup;
	
	constructor(		
		private messageService: MessageService,
		private fb: FormBuilder,
		// private el: ElementRef,
		// private zone: NgZone,
		private routeParams: RouteParams,
		@Inject('config.orderStatus') public configOrderStatus
	) {
		this.form = fb.group({
			order: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.orderId = this.routeParams.get('id');
		
		this.getMessages();
	}

	public ngOnInit(): void {		
		//this.getMessages();
	}
	
	public ngOnChanges(changes: {[propertyName: string]: SimpleChange}): void {
		// Empty the changeLog whenever counter goes to zero
		// hint: this is a way to respond programmatically to external value changes.
		/*if (this.counter === 0) {
			this.changeLog.length = 0;
		}

		// A change to `counter` is the only change we care about
		let prop = changes['counter'];
		let cur = prop.currentValue;
		let prev = JSON.stringify(prop.previousValue); // first time is {}; after is integer
		this.changeLog.push(`counter: currentValue = ${cur}, previousValue = ${prev}`);*/
		
		//this.getMessages();
		
	}
	
	public getMessages(): void {
		this.formModel.order = this.orderId;
		
		this.messageService.getByOrderId(this.orderId)
			.subscribe(res => {	
console.dir(res)			
				this.messages = res.messages;
				this.order = res.order;
				
				if (res.messages.length) {
					this.lastMid = res.messages[res.messages.length - 1]._id;				
				} else {
					this.lastMid = '';
				}				
			}, error => {
				console.dir(error);
			}, () => {
				console.log('done')
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
			}, error => {
				console.dir(error);
			}, () => {
				console.log('done')
			});
	}	
	
	private onSubmit(value:Object): void {
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

























