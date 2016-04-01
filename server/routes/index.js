var express = require('express');
var router = express.Router();
var mdlwares = require('../libs/mdlwares');

var debug = require('debug')('osliknet:server');
var config = require('../config');
var paypal = require('paypal-rest-sdk');

paypal.configure(config.paypal.api);

router.get('/', mdlwares.renderIndexUnlessXhr);



module.exports = router;


return;

router.get('/ggggggggggggggggggpaypal/cancel', function(req, res, next) {
	res.type('html').send('Canceled payment. <script>setTimeout(function() {window.location='/'}, 2000)</script>');
});

/*router.get('/paypal/payout', function(req, res, next) {
	var sender_batch_id = Math.random().toString(36).substring(9);

	var create_payout_json = {
		"sender_batch_header": {
			"sender_batch_id": sender_batch_id,
			"email_subject": "You have a payment"
		},
		"items": [
			{
				"recipient_type": "EMAIL",
				"amount": {
					"value": 3,
					"currency": "USD"
				},
				"receiver": "jechanceux-customer@gmail.com",
				"note": "Thank you.",
				"sender_item_id": "item_3"
			}
		]
	};

	var sync_mode = 'false';

	paypal.payout.create(create_payout_json, sync_mode, function (error, payout) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log("Create Single Payout Response");
			console.log(payout);
		}
	});
});*/

router.get('/dfffffffffffffpaypal/execute', function(req, res, next) {
	//paymentId=PAY-011062373N1272208K3YYOKI&token=EC-60W27794J27018634&PayerID=YUDW2TUGYKZ7L
	// req.query.paymentId
	// req.query.token
	// req.query.PayerID
	
	var execute_payment_json = {
		"payer_id": req.query.PayerID/*,
		"transactions": [{
			"amount": {
				"currency": "EUR",
				"total": "45"
			},
			"description": "WTF"
		}]*/
	};

	paypal.payment.execute(req.query.paymentId, execute_payment_json, function (error, payment) {
		if (error) {
			debug('execute errorerrorerrorerrorerror:');
			debug(JSON.stringify(error, null, 2));
		} else {
			debug('execute Get Payment Response:');
			debug(JSON.stringify(payment, null, 2));
			res.type('text').send('thx.');
		}
	});
});

router.get('/ffffffffffffffpaypal', function(req, res, next) {
	var confPayment = config.fees;
	
	var safe = 1 * ( Number( req.query.safe ) || 0 ).toFixed(2),
		cur = req.query.cur;
		
	var curConfig = confPayment.cur[cur];
	
	if (safe < 0.01 || !curConfig) {
		res.status(400).type('json').json({});
		return;
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

	var invoice = {
		intent: "sale",
		// intent: "pay_upon_invoice",
		// intent: "authorize",
		payer: {
			"payment_method": "paypal"
		},
		redirect_urls: {
			return_url: "http://localhost:8080/paypal/execute",
			cancel_url: "http://localhost:8080/paypal/cancel"
		},
		transactions: [{
			item_list: {
				items: [{
					name: "The amount for the ****tripper",
					price: p.safe,
					currency: cur,
					quantity: 1
				},{
					name: "PayPal fee (" + p.nonRefundablePaypal + cur + " non-refundable)",
					price: p.paypalFee,
					currency: cur,
					quantity: 1
				},{
					name: "Osliki.Net fee (" + p.nonRefundableOsliki + cur + " non-refundable)",
					price: p.oslikiFee,
					currency: cur,
					quantity: 1
				}]
			},
			amount: {
				currency: cur,
				total: p.total
			},
			description: "This is the payment description."
		}]
	};
	
	// debug(JSON.stringify(invoice, null, 2));
	// return

	paypal.payment.create(invoice, function (error, payment) {
		debug('create paymentpaymentpayment:');
		debug(JSON.stringify(payment, null, 2));
debug(JSON.stringify(p, null, 2));

		if (error) {
			debug('error paymentpaymentpayment:');
			debug(JSON.stringify(error, null, 2));
		} else {			
			if (payment.payer.payment_method === 'paypal') {
				  req.session.paymentId = payment.id;
				  var redirectUrl;
				  for(var i=0; i < payment.links.length; i++) {
					var link = payment.links[i];
					if (link.method === 'REDIRECT') {
					  redirectUrl = link.href;
					}
				  }
// return;
				  res.redirect(redirectUrl);
			}
		}
	});
	
return;
	
	/*paypal.invoice.send('', function (error, rv) {
		if (error) {
			console.log(error.response);
			throw error;
		} else {
			console.log("Send Invoice Response");
			console.log(rv);
		}
	});*/
	
	/*var create_invoice_json = {
		merchant_info: {
			email: "jechanceux-facilitator@gmail.com"
		},
		billing_info: [{
			email: "jechanceux-customer@gmail.com"
		}],
		"items": [{
			"name": "shipping",
			"quantity": 1.0,
			"unit_price": {
				"currency": "EUR",
				"value": 100
			}
		}],
		"tax_inclusive": false
	};
	
	
	paypal.invoice.create(create_invoice_json, function (error, invoice) {
		if (error) {
			//throw error;
			debug(error)
		} else {
			debug("Create Invoice Response");
			debug(JSON.stringify(invoice, null, 2));
			
			
			var invoiceId = invoice.id;

			paypal.invoice.send(invoiceId, function (error, rv) {
				if (error) {
					console.log(error.response);
					throw error;
				} else {
					debug("Send Invoice Response");
					debug(JSON.stringify(rv, null, 2));
				}
			});
		}
	});*/


});














/*


Review and process refund

Confirm the refund details and then click Issue Refund. To make changes, click Edit.
Name	test buyer
Email	jechanceux-buyer@gmail.com
Transaction ID	0PE308074G611334B
Original payment	$6.00 USD
Amount Refunded by Seller	$5.83 USD
Fees Refunded by PayPal	$0.17 USD
Total Refund Amount	$6.00 USD Help



*/