import {Component, Inject, OnDestroy} from 'angular2/core';
import {/*FORM_DIRECTIVES, CORE_DIRECTIVES, */FormBuilder, ControlGroup, Validators} from 'angular2/common';//, FORM_BINDINGS
import {ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';

// import {OrderCardComponent} from './order-card.component';
import {ModalComponent} from '../services/modal/modal.component';

import {OrderService} from '../services/order/order.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/client_src/tmpls/order-add.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [FormBuilder],
	pipes: [ToDatePipe]
	// viewBindings: [FORM_BINDINGS],
})

export class OrderAddComponent implements
	OnDestroy
{	
	public model : any = {};
	public form : ControlGroup;
	
	public order : any = {};
	
	private _modalComponent : ModalComponent;

	private _checked = false;
	
	constructor(
		private _orderService : OrderService,
		private _router : Router,
		private _location : Location,
		@Inject(FormBuilder) private _fb : FormBuilder,
		@Inject('trip') public trip,
		@Inject('config.user') public configUser
	) {
		this.form = _fb.group({
			trip: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.model.trip = trip._id;
		
		this._orderService.getByTripId(trip._id).subscribe(data => {					
			this.order = data.order || {};
			
			this._checked = true;
		}, err => {
			this._checked = true;	
		});
		
		this._locationSubscribe = this._location.subscribe(() => {
			this.closeModal();
		});
		
		this.showModal();
	}
	
	public ngOnDestroy() : void {
		this._locationSubscribe.unsubscribe();
	}
	
	public showModal() : void {
		this._modalComponent && this._modalComponent.show();
	}
	
	public closeModal() : void {
		this._modalComponent && this._modalComponent.close();
	}

	/*public onClick() : boolean {
		this._router.navigate(['Order', {id: this.order._id}]);
		this.closeModal();
		
		return false;
	}*/
	
	private _busy = false;
	public error : string = '';
	
	public onSubmit($textarea) : void {
		if (!this.form.controls.message.valid) {
			$textarea.focus();
			
			return;
		}
		
		if (this.form.valid && !this._busy) {
			this._busy = true;
			
			this._orderService.add(this.model).subscribe(data => {					
				//this.closeModal();
				this.error = '';
				this.order = data.order || {};
				
				this._busy = false;				
			}, err => {
				this.error = 'Unexpected error. Try again later.';

				try {
					this.error = err.json().error || this.error;
				} catch(e) {}
				
				this._busy = false;	
			});
		}
	}
}