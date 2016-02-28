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
	public newPrivMessages : Dictionary;
	public newPrivMessagesKeys : string[] = [];
	public isOpened : boolean = false;
	
	constructor(
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef
	) {
		this._notificationService.start().subscribe(data => {
console.log('NotificationsComponent subscribe')
console.dir(data);
			this.newOrders = data.newOrders;
			this.newMessages = data.newMessages;
			this.newMessagesKeys = this.getKeys(data.newMessages);
			this.newPrivMessages = data.newPrivMessages;
			this.newPrivMessagesKeys = this.getKeys(data.newPrivMessages);
console.log('this.newPrivMessagesKeys', this.newPrivMessagesKeys);
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
	}
	
	public getKeys(obj) : string[] {
		if (!obj) {
			return [];
		}
		
		return Object.keys(obj).filter(function(key) {
			return obj[key][0];
		})
	}
}

interface Dictionary {
    [ index: string ]: string
}

























