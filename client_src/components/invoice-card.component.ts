import {Component, Input, OnInit, OnChange, SimpleChange, Inject} from 'angular2/core';

import {InvoiceService}  from '../services/invoice/invoice.service';

import {ToDatePipe} from '../pipes/to-date.pipe';

@Component({
	selector: 'invoice-card',
	templateUrl: '/client_src/tmpls/invoice-card.html',
	pipes: [ToDatePipe]
})

export class InvoiceCardComponent implements
	OnInit,
	OnChange
{
	// @Input() amount : number = 0.01;
	// @Input() currency : string = 'USD';
	@Input() invoice : any = {};
	
	public fees : any;
	
	constructor(
		private _invoiceService : InvoiceService,
		@Inject('config.user') public configUser,
		@Inject('config.invoiceStatus') public invoiceStatus,
		@Inject('config.invoiceStatusConst') public sts
	) {
		
	}
	
	public ngOnInit() : void {
		//this.fees = this._invoiceService.getFees(this.amount, this.currency);
		
		
	}
	
	
	public error : string = '';
	
	private _busy : boolean = false;
		
	public checkStatus($event) : void {
		$event.preventDefault();
		
		this._busy = true;
		this.error = '';

		this._invoiceService.check(this.invoice._id).subscribe(data => {
			if (data && data.status) {
				this.invoice.status = data.status;
			} else {
				this.error = 'Unexpected error. Try again later.';
			}
			
			this._busy = false;
		}, err => {
			this.error = 'Unexpected error. Try again later.';

			try {
				this.error = err.json().error || this.error;
			} catch(e) {}
			
			this._busy = false;
		});
		
	}
	
	public ngOnChanges(changes: {[propName: string]: SimpleChange}) : void {
		// if ( changes.amount || changes.currency /*&& !changes.amount.isFirstChange() */ ) {
		if ( changes.invoice ) {
			this.fees = this._invoiceService.getFees(this.invoice.amount, this.invoice.currency);
		}
	}
}