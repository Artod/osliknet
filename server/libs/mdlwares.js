var captcha = require('../libs/captcha');
var jade = require('jade');
var Order = require('../models/order');

module.exports.checkOrderAccess = function(req, res, next) {
	Order.findById( req.body.order || req.params.id ).populate('trip').exec(function(err, order) {
		if (err) {
			//logger.error(err, {line: 16});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}

		if (!order) {
			res.status(400).type('json')
				.json({error: 'Order not found.'}); 
				
			return;
		}
		
		var orderUser = order.user.toString(),
			tripUser = order.trip.user.toString(); //order.tripUser

		if (req.session.uid !== orderUser && req.session.uid !== tripUser) {
			res.status(401).type('json').json({error: 'Unauthorized'});

			return;
		}
		
		res.order = order;
		
		next();
	});
};

module.exports.checkCaptcha = function(req, res, next) {
	if (req.session.uid) {
		next();
		
		return; 
	}

	captcha.verify(req.body['recaptcha'], function(success) {
		if (success) {
			next();
		} else {
			res.status(400).type('json')
				.json({error: 'Invalid captcha.'});
		}
	});
};
 
module.exports.restricted = function(req, res, next) {
	if (req.session.uid) {
		next();
		
		return;
	}
	
	if (req.xhr) {
		res.status(401).type('json').json({error: 'Unauthorized'});
	} else {
		res.redirect('/users/login');
	}
};

var getCompiled = function(path) {
	if (process.env.NODE_ENV === 'production') {
		return jade.compileFile( require.resolve(path, {cache: true}) );		
	} else {
		return function(data) {
			var indexCompiled = jade.compileFile( require.resolve('../views/dev_index.jade', {cache: true}) );
			return indexCompiled(data);
		}
	}
};

var indexCompiled = getCompiled('../views/index.jade');

module.exports.tripCompiled = getCompiled('../views/trip.jade');

module.exports.renderIndexUnlessXhr = function(req, res, next) {
	if (req.xhr) {
		next();
		
		return;
	}
	
	// res.render('index');
	// content-type:text/html; charset=utf-8
	
	
    res.type('html').write( indexCompiled(res.locals) );
    res.end();
};

/*module.exports.renderTripUnlessXhr = function(req, res, next) {
	if (req.xhr) {
		next();
		
		return;
	}
	
    res.type('html').write( tripCompiled(res.locals) );
    res.end();
};*/