var express = require('express');
var router = express.Router();
var captcha = require('../libs/captcha');

var Trip = require('../models/trip');
var Subscribe = require('../models/subscribe');



/*router.get('/', function(req, res, next) {
	var limit = Number(req.query.limit);	
	limit = (limit && limit < 30 ? limit : 30);
	
	var page = Number(req.query.page) || 0;
	
	Review.find({
		$or: [{
			user: req.session.uid
		}, {
			corr: req.session.uid
		}]
	}).sort('-_id').skip(page * limit).limit(limit).populate('user corr').exec(function(err, reviews) {
		if (err) {
			res.status(500).type('json')
				.json({error: err});
				
			return;
		}
	
		res.type('json')
			.json({reviews: reviews});
	});
});*/

router.get('/cancel/:id', function(req, res, next) {
	Subscribe.findById(req.params.id).exec(function(err, subscribe) {
		if (err) {
			res.status(500).type('json')
				.json({error: err});
				
			return;
		}
		
		subscribe.is_unsubed = true;
		
		subscribe.save(function(err, subscribe) {
			if (err) {
				res.status(500).type('json')
					.json({error: err});
					
				return;
			}
			
			if (!req.xhr) {
				res.type('text').send('You have successfully unsubscribed from notifications about new trips from ' + subscribe.from + ' to ' + subscribe.to + '.');
				
				return;
			} else {
				res.type('json').json({});
			}
		});
	});

});

var checkCaptcha = function(req, res, next) {
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

router.post('/add', checkCaptcha, function(req, res, next) {
	req.body.email = req.session.email || req.body.email;
	req.body.is_unsubed = false;
	
	Subscribe.findOne({
		from_id: req.body.from_id,
		to_id: req.body.to_id,
		email: req.body.email
	}).exec(function(err, subscribe) {
		if (err) {
			res.status(500).type('json')
				.json({error: err});
				
			return;
		}
		
		if (subscribe) {
			if (!subscribe.is_unsubed) {
				res.type('json')
					.json({subscribe: subscribe});
					
				return;
			} else {				
				subscribe.is_unsubed = false;
				subscribe.save(function(err, subscribe) {
					if (err) {
						res.status(500).type('json')
							.json({error: err});
							
						return;
					}
					
					res.type('json')
						.json({subscribe: subscribe});
				});
				
				return;
			}
		} else {
			if (req.session.uid) {
				req.body.user = req.session.uid;
			}
			
			subscribe = new Subscribe(req.body);
			
			subscribe.save(function(err, subscribe) {
				if (err) {
					res.status(err.name === 'ValidationError' ? 400 : 500)				
					
					res.type('json')
						.json({error: err});
						
					return;
				}
				
				res.type('json')
					.json({subscribe: subscribe});
			});			
		}
	});

});


module.exports = router;

























