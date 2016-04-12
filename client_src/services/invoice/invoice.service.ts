import {Injectable, Inject} from 'angular2/core';
import {Http, URLSearchParams, Headers} from 'angular2/http';

@Injectable()

export class InvoiceService {
	constructor(
		public http : Http,
		@Inject('config.fees') public configFees
	) { }

	public add(data) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/invoices/add?xhr', JSON.stringify(data), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public pay(invoiceId) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/invoices/pay?xhr', JSON.stringify({invoiceId: invoiceId}), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public unhold(invoiceId) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/invoices/unhold?xhr', JSON.stringify({invoiceId: invoiceId}), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public refund(invoiceId) {
		let headers = new Headers();
		headers.append('Content-Type', 'application/json');
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.post('/invoices/refund?xhr', JSON.stringify({invoiceId: invoiceId}), {			
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public getByOrderId(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/invoices/order/' + id + '?xhr', {
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public check(id) {	
		let headers = new Headers();
		headers.append('X-Requested-With', 'XMLHttpRequest');
	
		return this.http.get('/invoices/check/' + id + '?xhr', {
			headers: headers
		}).map( res => <any[]> res.json() );
	}
	
	public getFees(amount, currency) : {} {
		var confPayment = this.configFees;
		
		var safe = 1 * ( Number( amount ) || 0 ).toFixed(2);

		var curConfig = confPayment.cur[currency];
		
		if (safe < 0.01 || !curConfig) {
			return false;
		}

		var oslikiFix = curConfig.oslikiFix,
			paypalFix = curConfig.paypalFix,
			oslikiPr = confPayment.oslikiPr,
			paypalPr = confPayment.paypalPr,
			fixes = oslikiFix + paypalFix;
		
		var p = {
			safe: safe
		};

		p.oslikiFee = oslikiFix + (p.safe/100) * oslikiPr;
		
		// p.total     = ( (p.safe + fixes) * 100 ) / (100 - oslikiPr - paypalPr);
		p.total     = ( ( p.safe + paypalFix + p.oslikiFee ) * 100 ) / (100 - paypalPr);
		
		p.paypalFee = 1 * ( paypalFix + (p.total/100) * paypalPr ).toFixed(2);
		p.oslikiFee = 1 * p.oslikiFee.toFixed(2)
		
		p.total     = p.safe + p.oslikiFee + p.paypalFee;
		
		// p.refundable       = (p.total * (100 - paypalPr) - 100*fixes) / (100-paypalPr);
		p.nonRefundable       = fixes + fixes/100*paypalPr;
		p.refundable          = p.total - p.nonRefundable;
		p.nonRefundableOsliki = oslikiFix;
		p.nonRefundablePaypal = p.nonRefundable - p.nonRefundableOsliki;

		Object.keys(p).forEach(function(key) {
			p[key] = p[key].toFixed(2);
		});
		
		return p;
	}
}