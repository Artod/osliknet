import {Component, Inject} from 'angular2/core';
import {FormBuilder, ControlGroup, Validators} from 'angular2/common';
import {Location} from 'angular2/router';

import {ModalComponent} from '../services/modal/modal.component';
import {InvoiceCardComponent} from '../components/invoice-card.component';

import {InvoiceService}  from '../services/invoice/invoice.service';

@Component({
	templateUrl: '/client_src/tmpls/invoice-add.html',
	providers: [FormBuilder],
	directives: [InvoiceCardComponent]
})

export class InvoiceAddComponent {
	
	public invoices : any[] = [];
	
	public model : any = {
		currency: 'USD',
		amount: 25.00,
		agree: true
	};

	public form : ControlGroup;
	
	private _modalComponent : ModalComponent;
	
	private _loaded : boolean;
	
	constructor(
		private _fb : FormBuilder,		
		private _invoiceService : InvoiceService,
		private _location : Location,
		@Inject('order') public order : {},
		@Inject('onInvoiceAdd') public onInvoiceAdd : Function,
		@Inject('config.user') public configUser,
		@Inject('config.invoiceStatusConst') public sts
	) {
		this.form = this._fb.group({
			order: ['', Validators.required],
			amount: ['', (ctrl) => {
				let amount = Number(ctrl.value);
				if ( !amount && ( !amount || amount < 0.01 ) ) {
					return {invalidAmount: true};
				}
				
				return null;
			}],
			currency: ['', Validators.required],
			dest_id: ['', (ctrl) => {
				if ( !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value) ) {
					return {invalidEmail: true};
				}
				
				return null;
			}],
			comment: '',
			agree: ['', (ctrl) => {				
				if ( !ctrl.value ) {
					return {invalidAgree: true};
				}
				
				return null;
			}]
		});

		this.model.order = this.order._id;
		this.model.dest_id = this.order.trip.user.email;
		
		this._loaded = false;
		
		this._invoiceService.getByOrderId(this.order._id).subscribe(data => {

			this.invoices = data && data.invoices || [];
		
			let first = this.invoices[0];

			
			if (first) {

				this.model.dest_id = first.dest_id;
				this.model.amount = first.amount;
				this.model.currency = first.currency;
			}
		
			this._loaded = true;

		}, err => {
			this._loaded = true;
		});
		
		this._locationSubscribe = this._location.subscribe(() => {
			this.closeModal();
		});
	}
	
	public error : string = '';
	
	private _busy : boolean = false;
		
	public onSubmit($dest_id, $amount, $agree) : void {	
		if (!this.form.controls.dest_id.valid) {
			$dest_id.focus();
			
			return;
		}
		
		if (!this.form.controls.amount.valid) {
			$amount.focus();
			
			return;
		}	
		
		if (!this.form.controls.agree.valid) {
			$agree.focus();
			
			return;
		}		
		
		if (!this.form.valid) {
			return;
		}		

		this._busy = true;
		this.error = '';

		this._invoiceService.add(this.model).subscribe(data => {				
			this.closeModal();

			this.onInvoiceAdd();
			
			this._busy = false;
		}, err => {
			this.error = 'Unexpected error. Try again later.';

			try {
				this.error = err.json().error || this.error;
			} catch(e) {}
			
			this._busy = false;
		});
		
	}
	
	public ngOnDestroy() : void {
		this._locationSubscribe.unsubscribe();
	}
	
	public closeModal() : void {
		this._modalComponent && this._modalComponent.close();
	}
	
	public onChangeRating(el) : void {
		if (el.checked) {
			this.model.rating = el.value;
		}
	}
	
	private _busyInvoice : boolean[] = [];
	
	public errorInvoice : string[] = [];	
	
	public payInvoice(invoiceId, $agree) : void {
		if (!$agree.checked) {
			$agree.focus();
			
			return;
		}
		
		this.errorInvoice[invoiceId] = '';
		this._busyInvoice[invoiceId] = true;

		this._invoiceService.pay(invoiceId).subscribe(data => {
			if (data.redirectUrl) {
				window.location = data.redirectUrl;
			} else {
				this._busyInvoice[invoiceId] = false;
				this.errorInvoice[invoiceId] = 'Unexpected error. Try again later.';
			}
		
			//this.closeModal();

			//this.onInvoiceAdd();
			
		}, err => {
			this.errorInvoice[invoiceId] = 'Unexpected error. Try again later.';

			try {
				this.errorInvoice[invoiceId] = err.json().error || this.errorInvoice[invoiceId];
			} catch(e) {}
			
			this._busyInvoice[invoiceId] = false;
		});
	}
	
	public invoiceAct(act, invoiceId, $agree) : void {
		if (!$agree.checked) {
			$agree.focus();
			
			return;
		}
		
		if ( !confirm('Are you sure?') ) {
			return;
		}
		
		this.errorInvoice[invoiceId] = '';
		this._busyInvoice[invoiceId] = true;

		this._invoiceService[act](invoiceId).subscribe(data => {		
			this.closeModal();

			this.onInvoiceAdd();
			
		}, err => {
			this.errorInvoice[invoiceId] = 'Unexpected error. Try again later.';

			try {
				this.errorInvoice[invoiceId] = err.json().error || this.errorInvoice;
			} catch(e) {}
			
			this._busyInvoice[invoiceId] = false;
		});
	}

}