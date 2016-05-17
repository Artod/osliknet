import {Component, Inject, ApplicationRef, ElementRef, /*Renderer, */Injector, provide, OnDestroy, AfterViewInit} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams, Router, Location} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {SubscribeService} from '../services/subscribe/subscribe.service';
import {ModalService} from '../services/modal/modal.service';
import {NotificationService} from '../services/notification/notification.service';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';
import {GotoComponent} from './goto-card.component';

import {OrderAddComponent} from './order-add.component';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/client_src/tmpls/trip.html',
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent, GotoComponent],
	pipes: [ToDatePipe]
})

export class TripComponent implements OnDestroy, AfterViewInit {
	public tripId : string = '';
	
	public trip : any = {};
	public subscribe : any = {};
	public orders : any[] = [];

	public model : any = {};
	public form : ControlGroup;
	
	public newMessages : any = {};
	private _notifSub;
	
	private _inited : boolean = false;
	
	public title : string = '';	
	public url : string = '';	
	
	constructor(
		private _router : Router,
		private _location : Location,
		// private _renderer : Renderer,
		private _modalService : ModalService,
		private _notificationService : NotificationService,
		private _orderService : OrderService,
		private _tripService : TripService,
		private _subscribeService : SubscribeService,
		
		private _routeParams : RouteParams,
		private _fb : FormBuilder,
		private _appRef : ApplicationRef,
		private _el : ElementRef,
		@Inject('config.user') public configUser
	) {
		this.tripId = this._routeParams.get('id');
		
		this.form = this._fb.group({ 
			id: ['', Validators.required],
			description: ['', Validators.required]
		});
		
		this.model.id = this.tripId;
		
		this._tripService.getById(this.tripId).subscribe(res => {
			this.trip = res.trip || {};
			this.orders = res.orders || [];
			this.subscribe = res.subscribe || {};
			
			this.title = encodeURIComponent('Order delivery from ' + this.trip.from + ' to ' + this.trip.to + '. | Osliki.Net — social delivery service');			
			this.url = encodeURIComponent(window.location.href);
			
			this.trip && ( this.model.description = (this.trip.description || '') );
			
			this._inited = true;
		}, error => {
			this._inited = true;
		});
		
		this.newMessages = this._notificationService.data.newMessages || {};
		
		this._notifSub = this._notificationService.start().subscribe(data => {
			this.newMessages = data.newMessages || {};
			this._appRef.tick();
		});
	}



	public ngAfterViewInit() {
		/*var s = document.createElement("script");
		s.type = "text/javascript";
		s.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-573a0d1b71869282";
		s.async = true;
		s.defer = true;
		this._el.nativeElement.appendChild(s);*/
	}
	
	public ngOnDestroy() : void {
		this._notifSub.unsubscribe();
	}
	
	private _busy = false;
	private editMode = false;
	
	public onSubmit($textarea) : void {
		if (!this.form.controls.description.valid) {
			$textarea.focus();
			
			return;
		}
		
		if (this.form.valid && !this._busy) {
			this._busy = true;

			this._tripService.update(this.model).subscribe(data => {
				if (data.trip) {
					this.trip.description = data.trip.description;
				}
				
				this._busy = false;
				this.editMode = false
			}, err => {
				this._busy = false;
				this.editMode = false
			});
		}
	}
	
	public onRequest(trip) : void {
		this._modalService.open().then(modalComponentRef => {
			var otherResolved = Injector.resolve([
				//provide(Renderer, {useValue: this._renderer}),
				provide(OrderService, {useValue: this._orderService}),
				provide(Router, {useValue: this._router}),
				provide(Location, {useValue: this._location}),
				provide('trip', {useValue: trip})
			]);
			
			this._modalService.bind(OrderAddComponent, modalComponentRef, otherResolved);
		});
	}
	
	public unsubscribe($link) : void {
		this._subscribeService.cancel(this.subscribe._id).subscribe(data => {
			$link.innerHTML = '<i>You have successfully unsubscribed!</i>';
		}, err => {
			$link.innerHTML = '<i>Something went wrong. Try again later.</i>';
		});
		
		return false;
	}
}