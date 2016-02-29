import {Component, Inject} from 'angular2/core';
import {/*FORM_DIRECTIVES, CORE_DIRECTIVES, */FormBuilder, ControlGroup, Validators} from 'angular2/common';//, FORM_BINDINGS
import {ROUTER_DIRECTIVES, Router, Location} from 'angular2/router';

// import {OrderCardComponent} from './order-card.component';
import {ModalComponent} from '../services/modal/modal.component';

import {OrderService} from '../services/order/order.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	templateUrl: '/app/tmpls/order-add.html',
	directives: [ROUTER_DIRECTIVES],
	providers: [FormBuilder],
	pipes: [ToDatePipe]
	// viewBindings: [FORM_BINDINGS],
})

export class OrderAddComponent {	
	public formModel : any = {};
	public form : ControlGroup;
	
	public order : any;
	
	private _modalComponent : ModalComponent;

	private _checked = false;
	
	constructor(
		private _orderService : OrderService,
		private _router : Router,
		private _location : Location,
		@Inject(FormBuilder) private _fb : FormBuilder,
		@Inject('trip') public trip
	) {
		this.form = _fb.group({
			trip: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.formModel.trip = trip._id;
		
		this._orderService.getByTripId(trip._id).subscribe(data => {					
			this.order = data.order;
			this._checked = true;
		}, err => {
			this._checked = true;	
		});
		
		this._location.subscribe(() => {
			this.closeModal();
		});
	}
	
	public closeModal() : void {
		this._modalComponent && this._modalComponent.close();
	}

	public onClick() : boolean {
		this._router.navigate(['Order', {id: this.order._id}]);
		this.closeModal();
		
		return false;
	}
	
	private _busy = false;
	public onSubmit(value : Object) : void {
		if (this.form.valid && !this._busy) {
			this._busy = true;
			
			this._orderService.add(this.formModel).subscribe(data => {					
				this.closeModal();
				this._busy = false;				
			}, err => {
				this._busy = false;	
			});
		}
	}
}