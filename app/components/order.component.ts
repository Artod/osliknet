import {Component, Inject, provide, Renderer, Injector, ApplicationRef} from 'angular2/core';	
import {ROUTER_DIRECTIVES, RouteParams} from 'angular2/router';

import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';
import {ReviewService}  from '../services/review/review.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';
import {ReviewAddComponent} from './review-add.component';
import {ChatComponent} from './chat.component';

@Component({
	selector: 'order',
	templateUrl: '/app/tmpls/order.html',
	pipes: [ToDatePipe],
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent, ChatComponent]
})

export class OrderComponent {
	public orderId : string;
	public isChatActual : boolean = false;
	public isTripPassed : boolean = false;

	public order : any = {};//trip: {}, user: {}	
	
	constructor (
		private _orderService : OrderService,
		private _modalService : ModalService,
		private _reviewService : ReviewService,
		private _routeParams : RouteParams,
		private _renderer : Renderer,
		private _appRef : ApplicationRef,
		@Inject('config.orderStatus') public configOrderStatus,
		@Inject('config.orderStatusConst') public sts,
		@Inject('config.user') public configUser
	) {
		this.orderId = this._routeParams.get('id');
	}
	
	private _changeStatusBusy : boolean = false;
	
	public changeStatus(status) : void {
		if (this._changeStatusBusy) {
			return;
		}
		
		this._changeStatusBusy = true;
		
		this._orderService.changeStatus(status, this.orderId).subscribe(data => {				
			this.isChatActual = false;
			this._changeStatusBusy = false;
		}, err => {
			console.dir(err);
			this._changeStatusBusy = false;
		});
	}
	
	public sendReview() : void {
		this._modalService.open().then(modalComponentRef => {			
			this._modalService.bind( ReviewAddComponent, modalComponentRef, Injector.resolve([
				provide(Renderer, {useValue: this._renderer}),				
				provide(ReviewService, {useValue: this._reviewService}),				
				provide('orderId', {useValue: this.orderId}),
				provide('onReviewAdd', {
					useValue: () => {
						this.isChatActual = false;
					}
				})
			]) );
		})
	}
	
	public onOrder(order) : void {
		this.order = order;
		
		if (this.order && this.order.trip) {
			var now = (new Date()).getTime() - 1000*60*60*24;
			this.isTripPassed = ( new Date(this.order.trip.when) ) < now;
		}
	}
	
	public onOrderStatus(status) : void {
		this.order.status = status;
		this._appRef.tick();
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