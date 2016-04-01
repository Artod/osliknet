import {Component, Inject, ApplicationRef} from 'angular2/core';
import {OnDestroy} from 'angular2/core';
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {MessageService} from '../services/message/message.service';
import {NotificationService} from '../services/notification/notification.service';

import {UserCardComponent} from './user-card.component';
import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/client_src/tmpls/dialogs.html',
	directives: [ROUTER_DIRECTIVES, UserCardComponent],
	pipes: [ToDatePipe]
})

export class DialogsComponent implements OnDestroy {
	public users : any[];
	public newPrivMessages : any;
	private _notifSub;
	
	constructor(
		private _messageService : MessageService,
		private _notificationService : NotificationService,
		private _appRef: ApplicationRef,
		@Inject('config.user') public configUser
	) {		
		this._messageService.getDialogs().subscribe(res => {			
			this.users = res.users;
		}, error => {
			
		});
		
		this.newPrivMessages = this._notificationService.data.newPrivMessages || {};
		
		this._notifSub = this._notificationService.start().subscribe(data => {
			this.newPrivMessages = data.newPrivMessages || {};
			this._appRef.tick();
		});
	}
	
	public ngOnDestroy() : void {
		this._notifSub.unsubscribe();
	}
}