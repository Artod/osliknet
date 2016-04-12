var paypal = require('paypal-rest-sdk');
var config = require('../config');

paypal.configure(config.paypal.api);

module.exports.paypal = paypal;

module.exports.getFees = function(amount, currency) {
	var confPayment = config.fees;
		
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
/*
 * GET home page.


exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};



exports.init = function(c){
  config = c;
  paypal.configure(c.api);
} */