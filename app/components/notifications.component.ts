import {Component, ApplicationRef} from 'angular2/core';
import {ROUTER_DIRECTIVES} from 'angular2/router';

import {ToDatePipe} from '../pipes/to-date.pipe';
import {NotificationService} from '../services/notification/notification.service';

@Component({
	selector: '[notifications]',
	templateUrl: '/app/tmpls/notifications.html',
	directives: [ROUTER_DIRECTIVES],
	pipes: [ToDatePipe]
})

export class NotificationsComponent {
	public newOrders : string[] = [];
	public newMessages : Dictionary;
	public newMessagesKeys : string[] = [];
	public isOpened : boolean = false;
	
	constructor(
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef
	) {
		this._notificationService.start().subscribe(data => {
console.log('NotificationsComponent subscribe')
			this.newOrders = data.newOrders;
			this.newMessages = data.newMessages;
			this.newMessagesKeys = this.getNewMessagesKeys();
console.log('this.newOrders');console.dir(this.newOrders);console.log('this.newMessages');console.dir(this.newMessages);
			
			this._appRef.tick();
		});
	}
	
	public onClick($event) {
		this.isOpened = !this.isOpened;
		
		$event.stopPropagation();
		
		return false;
	}
	
	public onDocumentClick($event) {
		this.isOpened = false;
		/*
		$event.stopPropagation();
		
		return false;*/
	}
	
	
	public lengthMessages() {
		return Object.keys(this.newMessages);
	}
	
	public getNewMessagesKeys() : string[] {
		return Object.keys(this.newMessages);
	}
}

interface Dictionary {
    [ index: string ]: string
}

























