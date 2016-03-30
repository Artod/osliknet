import {Component, Input, OnInit, OnChange, SimpleChange} from 'angular2/core';

import {InvoiceService}  from '../services/invoice/invoice.service';

@Component({
	selector: 'invoice-card',
	templateUrl: '/client_src/tmpls/invoice-card.html'
})

export class InvoiceCardComponent implements
	OnInit,
	OnChange
{
	@Input() amount : number = 0.01;
	@Input() currency : string = 'USD';
	
	public fees : any;
	
	constructor(
		private _invoiceService : InvoiceService
	) {
		
	}
	
	public ngOnInit() : void {
		//this.fees = this._invoiceService.getFees(this.amount, this.currency);
		
		
	}
	
	public ngOnChanges(changes: {[propName: string]: SimpleChange}) : void {
		if ( changes.amount || changes.currency /*&& !changes.amount.isFirstChange() */ ) {
			this.fees = this._invoiceService.getFees(this.amount, this.currency);
		}
	}
}