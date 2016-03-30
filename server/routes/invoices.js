var express = require('express');
var router = express.Router();
var mdlwares = require('../libs/mdlwares');

var Trip = require('../models/trip');
var Message = require('../models/message');
var Order = require('../models/order');
var User = require('../models/user');
var Invoice = require('../models/invoice');

var payments = require('../libs/payments');
var paypal = payments.paypal;
var getFees = payments.getFees;

var debug = require('debug')('osliknet:server');
var config = require('../config');

var winston = require('winston');
var path = require('path');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, '../logs/invoices.log')
		})
    ],
	exitOnError: false
});

router.post('/add', mdlwares.restricted, mdlwares.checkOrderAccess, function(req, res, next) {
	var order = res.order;
	
	var orderUser = order.user.toString(),
		tripUser = order.trip.user.toString(); //order.tripUser
	
	var fees = getFees(req.body.amount, req.body.currency);
		
	if (!fees) {
		res.status(400).type('json')
			.json({error: 'Unexpected server error.'});
		
		return;
	}
	
	req.body.user = tripUser;
	req.body.corr = orderUser;		
	
	var invoice = new Invoice(req.body);
	
	invoice.save(function(err, invoice) {
		if (err) {
			logger.error(err, {line: 105});
			
			res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		Message.addToOrder(order, {
			order: order._id,
			user: invoice.user,
			corr: invoice.corr,
			message: 'I have just sent an invoice to you.'
		}, function(err, message) {
			if (err) {
				logger.error(err, {line: 120});
				
				return;
			}
		});
		
		res.type('json')
			.json({invoice: invoice});
	});
});

router.get('/order/:id', mdlwares.restricted, mdlwares.checkOrderAccess, function(req, res, next) {
	var order = res.order;
	
	var orderUser = order.user.toString(),
		tripUser = order.trip.user.toString(); //order.tripUser
		
	Invoice.find({
		order: order._id
	}).select('+dest_id').exec(function(err, invoices) {
		if (err) {
			logger.error(err, {line: 87});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
	
		res.type('json')
			.json({invoices: invoices});
	});
});

router.get('/paypal/cancel', function(req, res, next) {
	res.type('html').send('Canceled payment. <script>setTimeout(function() {window.location='/'}, 2000)</script>');
});

router.get('/paypal/execute', function(req, res, next) {
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
			//debug('execute errorerrorerrorerrorerror:');
		} else {
			//debug('execute Get Payment Response:');
			//debug(JSON.stringify(payment, null, 2));
			res.type('text').send('thx.');
		}
	});
});

router.get('/paypal/create', function(req, res, next) {
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
	


});




module.exports = router;


