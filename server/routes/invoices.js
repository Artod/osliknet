var express = require('express');
var router = express.Router();
var mdlwares = require('../libs/mdlwares');
var async = require('async');

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

var sendgrid  = require('sendgrid')(config.sendgrid.key);

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

var sts = Invoice.sts;

var invoicesRequests = function(req, res, next, msg) {
	/*Invoice.findOne({
		_id: req.body.invoiceId,
		corr: req.session.uid,
		status: sts.PAID
	}).populate('order').exec(function(err, invoice) {*/
		
	Invoice.findById(req.body.invoiceId).populate('order').exec(function(err, invoice) {
		if (err) {
			logger.error(err, {line: 39});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!invoice) {
			res.status(400).type('json')
				.json({error: 'Invoice not found.'});
				
			return;
		}

		if (invoice.corr.toString() !== req.session.uid || invoice.status !== sts.PAID) {
			res.status(401).type('json').json({error: 'Unauthorized'});
				
			return;
		}

		msg = msg.replace('#', '#' + invoice._id);
		
		var email = new sendgrid.Email();
		
		email.addTo(config.emailAdmin);
		email.setFromName(config.name);
		email.subject = msg;
		email.from = config.email;
		
		email.text = email.subject;

		sendgrid.send(email, function(err, json) {
			if (err) {
				logger.error(err, msg, {line: 67});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}
			
			async.parallel({
				invoice: function(callback) {	
					invoice.status = sts.PENDING;
					invoice.save(function(err, invoice) {
						callback(err, invoice);
					});
				},
				message: function(callback) {
					Message.addToOrder(invoice.order, {
						order: invoice.order._id,
						user: invoice.corr,
						corr: invoice.user,
						message: msg
					}, function(err, message) {
						callback(err, message);
					});

				},                    
			}, function(err, asyncRes) {
				if (err) {
					logger.error(err, {line: 96});
				}

				res.type('json')
					.json({status: invoice.status});
			});
			
		});

	});
};

router.post('/unhold', mdlwares.restricted, function(req, res, next) {
	invoicesRequests(req, res, next, 'I have just requested to unhold money (invoice #).');
});

router.post('/refund', mdlwares.restricted, function(req, res, next) {
	invoicesRequests(req, res, next, 'I have just requested a refund (invoice #).');
});

router.post('/pay', mdlwares.restricted, function(req, res, next) {

/* 	Invoice.findOne({
		_id: req.body.invoiceId,
		corr: req.session.uid,
		status: sts.UNPAID
	}).populate('user').exec(function(err, invoice) { */
	
	Invoice.findById(req.body.invoiceId).populate('user').exec(function(err, invoice) {
		if (err) {
			logger.error(err, {line: 135});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!invoice) {
			res.status(400).type('json')
				.json({error: 'Invoice not found.'});
				
			return;
		}
		
		if (invoice.corr.toString() !== req.session.uid || invoice.status !== sts.UNPAID) {
			res.status(401).type('json').json({error: 'Unauthorized'});
				
			return;
		}
		
		var fees = getFees(invoice.amount, invoice.currency);
			
		if (!fees) {
			res.status(400).type('json')
				.json({error: 'Unexpected server error.'});
			
			return;
		}
		
		// var invoice = ;

		paypal.payment.create({
			intent: 'sale',
			// intent: "pay_upon_invoice",
			// intent: "authorize",
			payer: {
				payment_method: 'paypal'
			},
			redirect_urls: {
				return_url: config.host + 'invoices/paypal/execute?invoiceId=' + invoice._id,
				// cancel_url: config.host + "paypal/cancel"invoice
				cancel_url: config.host + 'messages/order/' + invoice.order
			},
			transactions: [{
				item_list: {
					items: [{
						name: 'The amount for the traveler "' + invoice.user.name + '" (invoice: #' + invoice._id + ')',
						price: fees.safe,
						currency: invoice.currency,
						quantity: 1
					},{
						name: 'Osliki.Net fee (' + fees.nonRefundableOsliki + ' ' + invoice.currency + ' non-refundable)',
						price: fees.oslikiFee,
						currency: invoice.currency,
						quantity: 1
					},{
						name: 'PayPal fee (' + fees.nonRefundablePaypal + ' ' + invoice.currency + ' non-refundable)',
						price: fees.paypalFee,
						currency: invoice.currency,
						quantity: 1
					}]
				},
				amount: {
					currency: invoice.currency,
					total: fees.total
				},
				description: 'Invoice: #' + invoice._id
			}]
		}, function(err, payment) {
			if (err) {
				logger.error(err, {line: 104});
				
				res.status(400).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			} else {
				invoice.payment = payment;
				invoice.save(function(err, invoice) {
					if (err) {
						logger.error(err, {line: 112});
					}
				});
			
				if (payment.payer.payment_method === 'paypal') { //!!!!!!!!!!!!!!!!!!!!!!!
					req.session.paymentId = payment.id;

					var redirectUrl;

					for (var i=0; i < payment.links.length; i++) {
						var link = payment.links[i];
						if (link.method === 'REDIRECT') {
							redirectUrl = link.href;
						}
					}

					//res.redirect(redirectUrl);
					res.type('json')
						.json({redirectUrl: redirectUrl});
						
						
						
					return;
				}
			}
		});
	});
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
	
	req.body.order = order._id;
	req.body.user = tripUser;
	req.body.corr = orderUser;		
	req.body.fees = fees;		
	req.body.status = sts.UNPAID;		
	req.body.payment = {};
	
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
	}).sort('-_id').select(tripUser === req.session.uid ? '+dest_id' : '').populate('user').exec(function(err, invoices) {
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

router.get('/check/:id', mdlwares.restricted, function(req, res, next) {

	Invoice.findById(req.params.id).select('+payment').exec(function(err, invoice) {
		if (err) {
			logger.error(err, {line: 322});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!invoice) {
			res.status(400).type('json')
				.json({error: 'Invoice not found.'});
				
			return;
		}

		if ( req.session.uid !== invoice.user.toString() && req.session.uid !== invoice.corr.toString() ) {
			res.status(401).type('json').json({error: 'Unauthorized'});
			
			return;
		}

		paypal.payment.get(invoice.payment.id, function (err, payment) {
			if (err) {
				logger.error(err, {line: 334});
				
				res.status(400).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			} else {
				var newStatus = sts.UNCLEARED;
				
				try {
					if ( payment.transactions[0].related_resources[0].sale.state === 'completed' ) {
						newStatus = sts.PAID;
					}
				} catch(err) {};
				
				if (newStatus !== invoice.status) {
					invoice.status = newStatus;
					invoice.payment = payment;
					invoice.markModified('payment');
					
					invoice.save(function(err, invoice) {
						if (err) {
							logger.error(err, {line: 356});
							
							res.status(400).type('json')
								.json({error: 'Unexpected server error.'});
								
							return;
						}
						
						res.type('json')
							.json({status: invoice.status});
					});
				} else {
					res.type('json')
						.json({status: invoice.status});
				}
			}
		});	
		
	});
});

router.get('/paypal/cancel', function(req, res, next) {
	res.type('html').send('Payment was canceled. <script>setTimeout(function() {window.location=\'/\'}, 2000)</script>');
});

router.get('/paypal/execute', mdlwares.restricted, function(req, res, next) {
	//paymentId=PAY-011062373N1272208K3YYOKI&token=EC-60W27794J27018634&PayerID=YUDW2TUGYKZ7L
	// req.query.paymentId
	// req.query.token
	// req.query.PayerID
	
	// var orderId = req.query.orderId;
	
	/*Invoice.findOne({
		_id: req.query.invoiceId,
		corr: req.session.uid
	}).populate('order').exec(function(err, invoice) {*/

	Invoice.findById(req.query.invoiceId).populate('order').exec(function(err, invoice) {
		if (err) {
			logger.error(err, {line: 232});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!invoice) {
			res.status(400).type('json')
				.json({error: 'Invoice not found.'});
				
			return;
		}
		
		if (invoice.corr.toString() !== req.session.uid) {
			res.status(401).type('json').json({error: 'Unauthorized'});
				
			return;
		}

		paypal.payment.execute(req.query.paymentId, {
			"payer_id": req.query.PayerID/*,
			"transactions": [{
				"amount": {
					"currency": "EUR",
					"total": "45"
				},
				"description": "WTF"
			}]*/
		}, function(err, payment) {
			var redirectUrl = config.host + "messages/order/" + invoice.order._id;
			
			if (err) {
				logger.error(err, {line: 420});
				res.type('html').send('Something went wrong. <a href="' + redirectUrl + '">Return to the order.</a>');
			} else {
				//debug('execute Get Payment Response:');
				//debug(JSON.stringify(payment, null, 2));
				// res.type('text').send('thx.');
				
				async.parallel({
					invoice: function(callback) {
						invoice.status = sts.UNCLEARED;
						
						try {
							if ( payment.transactions[0].related_resources[0].sale.state === 'completed' ) {
								invoice.status = sts.PAID;
							}
						} catch(err) {}
						
						invoice.payment = payment;
						
						invoice.save(function(err, invoice) {
							callback(err, invoice);
						});
					}, 
					message: function(callback) {
						Message.addToOrder(invoice.order, {
							order: invoice.order._id,
							user: invoice.corr,
							corr: invoice.user,
							message: 'I have just payed the invoice #' + invoice._id + '.'
						}, function(err, message) {
							callback(err, message);
						});
					},                    
				}, function(err, asyncRes) {
					if (err) {
						logger.error(err, {line: 287});
					}

					res.redirect(redirectUrl);
				});
			}
		});
	});
});

/*
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
*/



module.exports = router;


