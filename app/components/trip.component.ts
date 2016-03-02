import {Component, Inject, ApplicationRef, /*Renderer, */Injector, provide} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {ROUTER_DIRECTIVES, RouteParams, Router, Location} from 'angular2/router';

import {TripService} from '../services/trip/trip.service';
import {OrderService} from '../services/order/order.service';
import {ModalService} from '../services/modal/modal.service';
import {NotificationService} from '../services/notification/notification.service';

import {TripCardComponent} from './trip-card.component';
import {OrderCardComponent} from './order-card.component';
import {OrderAddComponent} from './order-add.component';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/trip.html',
	directives: [ROUTER_DIRECTIVES, TripCardComponent, OrderCardComponent],
	pipes: [ToDatePipe]
})

export class TripComponent {
	public tripId : string = '';
	
	public trip : any = {};
	public orders : any[] = [];

	public formModel : any = {};
	public form : ControlGroup;
	
	public newMessages : any = {};
	private _notifSub;
	
	private _inited : boolean = false;
	
	constructor(
		private _router: Router,
		private _location: Location,
		// private _renderer : Renderer,
		private _modalService : ModalService,
		private _orderService : OrderService,
		private _notificationService : NotificationService,
		private _tripService : TripService,
		
		private _routeParams : RouteParams,
		private _fb : FormBuilder,
		private _appRef: ApplicationRef,
		@Inject('config.user') public configUser
	) {
		this.tripId = this._routeParams.get('id');
		
		this.form = this._fb.group({ 
			id: ['', Validators.required],
			description: ''//['', Validators.required]
		});
		
		this.formModel.id = this.tripId;
		
		this._tripService.getById(this.tripId).subscribe(res => {
			this.trip = <any>res.trip;
			this.orders = <any[]>res.orders;
			
			this.trip && ( this.formModel.description = (this.trip.description || '') );
			
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
	
	private _busy = false;
	private editMode = false;
	
	public onSubmit() : void {	
		if (this.form.valid && !this._busy) {
			this._busy = true;

			this._tripService.update(this.formModel).subscribe(data => {
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
}