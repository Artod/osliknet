import {Component, Inject} from 'angular2/core';
import {/*FORM_DIRECTIVES, CORE_DIRECTIVES, */FormBuilder, ControlGroup, Validators} from 'angular2/common';//, FORM_BINDINGS

import {ModalComponent} from '../services/modal/modal.component';

import {OrderService} from '../services/order/order.service';

@Component({
	templateUrl: '/app/tmpls/request-add.html',
	// directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
	providers: [FormBuilder]
	// viewBindings: [FORM_BINDINGS],
})

export class RequestAddComponent {
	
	public formModel : any = {};

	public form : ControlGroup;
	
	private _modalComponent : ModalComponent;

	constructor(
		private _orderService : OrderService,
		@Inject(FormBuilder) private _fb : FormBuilder,
		@Inject('trip') public trip
	) {
		this.form = _fb.group({
			trip: ['', Validators.required],
			message: ['', Validators.required]
		});
		
		this.formModel.trip = trip._id;
	}
	
	onSubmit(value : Object) : void {
		if (this.form.valid) {

			this._orderService.add(this.formModel).subscribe(data => {					
				this._modalComponent && this._modalComponent.close();					
			}, err => {
				console.dir(err);
			});
		}
	}
}