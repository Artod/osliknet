import {Component, Input, Output, ApplicationRef, AfterViewChecked, OnDestroy, OnInit, OnChange, Inject, ElementRef, EventEmitter, SimpleChange} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';
import {FormBuilder, ControlGroup, Control, Validators} from 'angular2/common';

import {MessageService} from '../services/message/message.service';
import {NotificationService} from '../services/notification/notification.service';
import {ToDatePipe} from '../pipes/to-date.pipe';

declare var window: any;

@Component({
	selector: 'chat',
	templateUrl: '/client_src/tmpls/chat.html',
	pipes: [ToDatePipe],
	directives: [ROUTER_DIRECTIVES]
})

export class ChatComponent implements
	AfterViewChecked,
	OnDestroy,
	OnInit,
	OnChange
{
	@Input() public orderId : string;	
	@Input() public corrId : string;	
	@Input() public isChatActual : boolean = false;
	
	@Output() public isChatActualChange : EventEmitter<any> = new EventEmitter(); 
	@Output('user') public userOutput : EventEmitter<any> = new EventEmitter();
	@Output('order') public orderOutput : EventEmitter<any> = new EventEmitter();
	@Output('orderStatus') public orderStatusOutput : EventEmitter<any> = new EventEmitter();

	public messages : any[] = [];
	public lastId : string = '0';
	
	public formModel : any = {};
	public form : ControlGroup;
	
	// private _prevListTop : number = 0;
	public elChatList;
	
	private _notifSub;
	
	constructor (
		private _messageService : MessageService,
		private _notificationService : NotificationService,
		private _fb : FormBuilder,
		private _el : ElementRef,
		private _appRef : ApplicationRef,
		@Inject('config.user') public configUser
	) {
		this.form = _fb.group({			
			message: ['', Validators.required]
		});
	}
	
	public ngOnInit() : void {
// console.dir(this._el.nativeElement)
		
		this.elChatList = this._el.nativeElement.querySelector('.chat-list');
		
		this._notifSub = this._notificationService.start(3000).subscribe(data => {
			if (
				( this.orderId && data.newMessages && data.newMessages[this.orderId] && (data.newMessages[this.orderId][0] || data.newMessages[this.orderId][1] !== this.lastId) ) ||
				( this.corrId && data.newPrivMessages && data.newPrivMessages[this.corrId] && (data.newPrivMessages[this.corrId][0] || data.newPrivMessages[this.corrId][1] !== this.lastId) )
			) {
				this.getLastMessages();
			}
		});
		
		if (this.orderId) {
			this.form.controls.order = new Control('order', Validators.required);
			this.formModel.order = this.orderId;			
		} else if (this.corrId) {
			this.form.controls.corr = new Control('corr', Validators.required);
			this.formModel.corr = this.corrId;
		}
		
		this.getMessages();
	}
	
	public ngOnChanges(changes: {[propName: string]: SimpleChange}) : void {
		if ( changes.isChatActual && !changes.isChatActual.currentValue && !changes.isChatActual.isFirstChange() ) {
			this.getLastMessages();
		}		
	}
	
	public ngOnDestroy() : void {
		this._notificationService.changeTimeout();
		this._notifSub.unsubscribe();
	}
	
	private _chatHeight : number = 0;
	private _listTop : number;	
	
	public ngAfterViewChecked() : void {
		let listTop = Math.round( this.elChatList.getBoundingClientRect().top + (window.document.documentElement.scrollTop || window.document.body.scrollTop) ); // round for mozilla round
		
		if (this._listTop !== listTop) {
			this._listTop = listTop;
			this.expand(listTop);
		}
		
		if ( this._chatHeight !== this.elChatList.scrollHeight ) {
			this._chatHeight = this.elChatList.scrollHeight;
			this.scrollDown();
		}
	}
	

	
	public scrollDown() : void {
		this.elChatList.scrollTop = this.elChatList.scrollHeight;	
	}
	
	public expand(listTop?) : void {
		let windowHeight = window.innerHeight || window.document.document.documentElement.clientHeight || window.document.documentElement.clientHeight;
		
		listTop = listTop || ( this.elChatList.getBoundingClientRect().top + (window.document.documentElement.scrollTop || window.document.body.scrollTop) );

		let height = windowHeight - listTop - 160; // 160 form height
		
		this.elChatList.style.maxHeight = (height < 200 ? 200 : height) + 'px'; // 200 min height
	}
	
	public onResize() : void {
		this.expand();
	}
	
	public getMessages() : void {
		this._messageService.getAll(this.orderId, this.corrId).subscribe(res => {
			
			if (res.messages && res.messages.length) {
				this.messages = res.messages;
				this.lastId = res.messages[res.messages.length - 1]._id;				
			}
			
			if (this.orderId) {
				this.orderOutput.emit(res.order || {});				
			} else {
				this.userOutput.emit(res.user || {});
			}
			
			this.isChatActual = true;
			this.isChatActualChange.emit(this.isChatActual);

			this._busy = false;
			
			// setTimeout(() => this.scrollDown(), 0);			
		}, error => {
			this._busy = false;
		});
	}
	
	public getLastMessages() : void {
		this._messageService.getLastMessages(this.lastId, this.orderId, this.corrId).subscribe(res => {	
			if (res.messages && res.messages.length) {
				this.lastId = res.messages[res.messages.length - 1]._id;
				res.messages.forEach( message => this.messages.push(message) );				
			}
			
			if (this.orderId && res.order) {
				this.orderStatusOutput.emit(res.order.status);				
			}
			
			this.isChatActual = true;
			this.isChatActualChange.emit(this.isChatActual);
			
			this._appRef.tick();
		}, error => {
			console.dir(error);
		});
	}	
	
	private _busy : boolean = true;
	
	public onSubmit(elComment) : void {
		if (!this.form.valid) {
			elComment.focus();
		}
		
		if (this.form.valid && !this._busy) {
			this._busy = true;

			this._messageService.add(this.formModel).subscribe(message => {				
				this._busy = false;
				this.formModel.message = '';
				this.getLastMessages();
			}, err => {
				this._busy = false;
			});
		}
	}
}