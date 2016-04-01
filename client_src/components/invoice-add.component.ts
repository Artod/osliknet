import {Component, Inject} from 'angular2/core';
import {/*FORM_DIRECTIVES, CORE_DIRECTIVES, */FormBuilder, ControlGroup, Validators} from 'angular2/common';

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
	
	private _busy : boolean;

	constructor(
		private _fb : FormBuilder,		
		private _invoiceService : InvoiceService,
		@Inject('order') public order : {},
		@Inject('onInvoiceAdd') public onInvoiceAdd : Function,
		@Inject('config.user') public configUser
	) {
		this.form = this._fb.group({
			order: ['', Validators.required],
			amount: ['', Validators.compose([
				(ctrl) => {
					let amount = Number(ctrl.value);
					if ( ctrl.value && ( !amount || amount < 0.01 ) ) {
						return {invalidAmount: true};
					}
					
					return null;
				},
				Validators.required]
			)],
			currency: ['', Validators.required],
			dest_id: ['', Validators.compose([
				(ctrl) => {
					if ( !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(ctrl.value) ) {
						return {invalidEmail: true};
					}
					
					return null;
				},
				Validators.required]
			)],
			comment: '',
			agree: ['', Validators.required]
		});

		this.model.order = this.order._id;		
		
		this._busy = true;
		
		this._invoiceService.getByOrderId(this.order._id).subscribe(data => {		
			this.invoices = data && data.invoices || [];
			
			let last = this.invoices[this.invoices.length - 1];
			
			if (last) {				
				this.model.dest_id = last.dest_id;
				this.model.amount = last.amount;
				this.model.currency = last.currency;
			}
			
			this._busy = false;
		}, err => {
			this._busy = false;
		});
	}
	
	public closeModal() : void {
		this._modalComponent && this._modalComponent.close();
	}
	
	public onChangeRating(el) : void {
		if (el.checked) {
			this.model.rating = el.value;
		}
	}
	
	private _busyInvoice : boolean;
	public errorInvoice : string = '';
	
	public payInvoice(invoiceId) : void {
		this._invoiceService.pay(invoiceId).subscribe(data => {
			
			window.location = data.redirectUrl;
		
			this.closeModal();

			//this.onInvoiceAdd();
			
			this._busyInvoice = false;
			
		}, err => {
			this.errorInvoice = 'Unexpected error. Try again later.';

			try {
				this.errorInvoice = err.json().error || this.errorInvoice;
			} catch(e) {}
			
			this._busyInvoice = false;
		});
	}
	
	public error : string = '';
	
	public onSubmit(elComment) : void {
		if (!this.form.valid) {
			elComment.focus();
		}
		
		if (this.form.valid && !this._busy) {
			this._busy = true;

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
	}
}