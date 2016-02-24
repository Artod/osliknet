import {Component, Inject, Optional, Renderer} from 'angular2/core';
import {/*FORM_DIRECTIVES, CORE_DIRECTIVES, */FormBuilder, ControlGroup, Validators} from 'angular2/common';//, FORM_BINDINGS

import {Trip} from '../services/trip/trip';
import {Order} from '../services/order/order';
import {OrderService} from '../services/order/order.service';

@Component({
	templateUrl: '/app/tmpls/request-add.html',
	// directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
	providers: [FormBuilder]
	// viewBindings: [FORM_BINDINGS],
})

export class RequestAddComponent {
	// public trip: Trip;
	
	public formModel: any = {};	
	
	// public trip: Trip;

	public form: ControlGroup;
	
	private _modalComponent;

	constructor(
		@Inject(FormBuilder) private _fb: FormBuilder,
		@Inject('trip') public trip: Trip,
		private _orderService: OrderService	
	) {
		// private _trip: trip
		// console.log(11111111111111111111111111111);
		// console.dir(trip);
	
		this.form = _fb.group({  
			trip: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.formModel.trip = trip._id;
	}
	
	onSubmit(value:Object):void {
		if (this.form.valid) {

			this._orderService.add(this.formModel).subscribe(data => {					
				this._modalComponent && this._modalComponent.close();					
			}, err => {
				console.dir(err);
			}, () => {
				console.log('done')
			});
		}
	}
}