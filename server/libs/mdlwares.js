var captcha = require('../libs/captcha');
var jade = require('jade');

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

var indexCompiled = (function() {
	if (process.env.NODE_ENV === 'development') {
		return function(data) {
			var indexCompiled = jade.compileFile( require.resolve('../views/dev_index.jade', {cache: true}) );
			return indexCompiled(data);
		}
	} else {
		return jade.compileFile( require.resolve('../views/index.jade', {cache: true}) );		
	}
})();

module.exports.renderIndexUnlessXhr = function(req, res, next) {
	if (req.xhr) {
		next();
		
		return;
	}
	
	// res.render('index');
	
    res.write( indexCompiled(res.locals) );
    res.end();
};