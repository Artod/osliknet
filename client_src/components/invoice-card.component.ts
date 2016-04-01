import {Component, Input, OnInit, OnChange, SimpleChange, Inject} from 'angular2/core';

import {InvoiceService}  from '../services/invoice/invoice.service';

@Component({
	selector: 'invoice-card',
	templateUrl: '/client_src/tmpls/invoice-card.html'
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
		@Inject('config.invoiceStatus') public invoiceStatus
	) {
		
	}
	
	public ngOnInit() : void {
		//this.fees = this._invoiceService.getFees(this.amount, this.currency);
		
		
	}
	
	public ngOnChanges(changes: {[propName: string]: SimpleChange}) : void {
		// if ( changes.amount || changes.currency /*&& !changes.amount.isFirstChange() */ ) {
		if ( changes.invoice ) {
			this.fees = this._invoiceService.getFees(this.invoice.amount, this.invoice.currency);
		}
	}
}