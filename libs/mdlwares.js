var captcha = require('../libs/captcha');

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
				.json({error: 'Invalid captcha'});
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

module.exports.renderIndexUnlessXhr = function(req, res, next) {
	if (req.xhr) {
		next();
		
		return;
	}
	
	res.render('index');
};