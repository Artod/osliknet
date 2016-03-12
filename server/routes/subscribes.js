var express = require('express');
var router = express.Router();

var mdlwares = require('../libs/mdlwares');

var Trip = require('../models/trip');
var Subscribe = require('../models/subscribe');

var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: 'logs/subscribes.log'
		})
    ],
	exitOnError: false
});	

router.get('/cancel/:id', function(req, res, next) {
	Subscribe.findById(req.params.id).exec(function(err, subscribe) {
		if (err) {
			logger.error(err, {line: 22});
			
			res.status(500).type('text').send('Unexpected server error.');
				
			return;
		}
		
		subscribe.is_unsubed = true;
		
		subscribe.save(function(err, subscribe) {
			if (err) {
				logger.error(err, {line: 33});
				
				res.status(500).type('text').send('Unexpected server error.');
					
				return;
			}
			
			if (req.xhr) {
				res.type('json').json({});
			} else {
				res.type('text').send('You have successfully unsubscribed from notifications about new trips from ' + subscribe.from + ' to ' + subscribe.to + '.');
			}
		});
	});

});

router.post('/add', mdlwares.checkCaptcha, function(req, res, next) {
	req.body.email = req.session.email || req.body.email;
	req.body.is_unsubed = false;
	
	Subscribe.findOne({
		from_id: req.body.from_id,
		to_id: req.body.to_id,
		email: req.body.email
	}).exec(function(err, subscribe) {
		if (err) {
			logger.error(err, {line: 60});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
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
						logger.error(err, {line: 79});
						
						res.status(500).type('json')
							.json({error: 'Unexpected server error.'});
							
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
					logger.error(err, {line: 102});
					
					res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
						.json({error: 'Unexpected server error.'});
						
					return;
				}
				
				res.type('json')
					.json({subscribe: subscribe});
			});			
		}
	});

});


module.exports = router;


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























