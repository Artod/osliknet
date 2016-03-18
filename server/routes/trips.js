var express = require('express');
var router = express.Router();

var mdlwares = require('../libs/mdlwares');

var Trip = require('../models/trip');
var Order = require('../models/order');
var User = require('../models/user');
var Subscribe = require('../models/subscribe');

var config = require('../config');
var sendgrid  = require('sendgrid')(config.sendgrid.key);

var winston = require('winston');
var path = require('path');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, '../logs/trips.log')
		})
    ],
	exitOnError: false
});

router.get('/', mdlwares.renderIndexUnlessXhr, function(req, res, next) {
	var query = {};
	
	if (req.query.from_id) {		
		query.from_id = req.query.from_id;
	}
	
	if (req.query.to_id) {
		query.to_id = req.query.to_id;		
	}
	
	if (!query.from_id && !query.to_id) {
		res.type('json')
			.json({trips: []});
			
		return;
	}
	
	var now = (new Date()).getTime() - 1000*60*60*24;
	
	query.when = { $gt: now };
	
	// query.is_removed = false;
	
	if (req.query.lastId) {
		query._id = { $lt: req.query.lastId };	
	}	
	
	var limit = Number(req.query.limit);	
	limit = (limit && limit < 30 ? limit : 30);
	
	Trip.find(query).sort('-_id').limit(limit).populate('user').exec(function(err, trips) {
		if (err) {
			logger.error(err, {line: 57});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (req.session.uid) {
			Subscribe.findOne({
				from_id: req.query.from_id,
				to_id: req.query.to_id,
				is_unsubed: false,
				user: req.session.uid
			}).select('_id').exec(function(err, subscribe) {
				if (err) {
					logger.error(err, {line: 74});
					
					res.status(500).type('json')
						.json({error: 'Unexpected server error.'});
						
					return;
				}
				
				res.type('json').json({
					trips: trips,
					subscribe: subscribe
				});
			});			
		} else {
			res.type('json')
				.json({trips: trips});			
		}
		
		

			
		// res.render('trips/index', { trips: trips });
			
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
	});	
  
});

router.get('/my', mdlwares.restricted, mdlwares.renderIndexUnlessXhr, function(req, res, next) {
	var limit = Number(req.query.limit);	
	limit = (limit && limit < 30 ? limit : 30);
	
	var page = Number(req.query.page) || 0;
	
	Trip.find({
		user: req.session.uid
	}).sort('-_id').skip(page * limit).limit(limit).exec(function(err, trips) {
		if (err) {
			logger.error(err, req.session, {line: 112});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		var tids = trips.map(function(trip) {
			return trip._id;
		});
		
		Order.find({
			trip: {$in: tids}
		}).sort('status -created_at').populate('user').exec(function(err, orders) {
			if (err) {
				logger.error(err, {line: 129});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					// .json({error: err});
					
				return;
			}
			
			res.type('json')
				.json({
					trips: trips,
					orders: orders
				});	
		});
		

			
		// res.render('trips/index', { trips: trips });
			
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
	});
});

router.get('/add', mdlwares.restricted, mdlwares.renderIndexUnlessXhr);	

router.post('/add', mdlwares.restricted, function(req, res, next) {
	req.body.is_removed = false;	
	req.body.user = req.session.uid;

	var trip = new Trip(req.body);	
	
	trip.save(function(err, trip) {
		if (err) {
			logger.error(err, {line: 164});
			
			res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		Trip.find({user: trip.user}).count().exec(function(err, count) {
			if (err) {
				logger.error(err, {line: 174});
					
				return;
			}
			
			User.stats(req.session.uid, 't_cnt', count);
		});		
		
		Subscribe.find({
			from_id: trip.from_id,
			to_id: trip.to_id,
			is_unsubed: false
		}).select('+email').exec(function(err, subscribes) {
			if (err) {
				logger.error(err, {line: 188});
					
				return;
			}
			
			subscribes.forEach(function(subscribe) {
				if (subscribe.email === req.session.email) {					
					return;
				}
				
				if (subscribe.user) {
					User.setUnreaded('newTrips', subscribe.user, trip.id);					
				} else {
					var email = new sendgrid.Email();
					
					email.addTo(subscribe.email);
					email.subject = 'New trip on Osliki.Net';
					email.from = 'osliknet@gmail.com';
					
					email.text += 'Hello!\n\r\n\r';
					email.text += 'We have a new trip from ' + subscribe.from + ' to ' + subscribe.to + ' ' + config.host + 'trips/' + trip.id + '.\n\r';
					email.text += 'Unsubscribe: ' + config.host + 'subscribes/cancel/' + subscribe.id + ' .\n\r\n\r';
					email.text += 'Team http://Osliki.Net .';

					sendgrid.send(email, function(err, json) {
						if (err) {
							logger.error(err, {line: 214});
						}
					});
				}
			});
		});		
		
		res.type('json').json({trip: trip});
	});  
});

router.post('/update', mdlwares.restricted, function(req, res, next) {
	Trip.findById(req.body.id).exec(function(err, trip) {
		if (err) {
			logger.error(err, {line: 228});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!trip) {
			res.status(400).type('json')
				.json({error: 'Trip not found.'});
				
			return;
		}
		
		if (trip.user.toString() !== req.session.uid) {
			res.status(401).type('json').json({error: 'Unauthorized'});
				
			return;
		}
		
		trip.description = req.body.description;
		
		trip.save(function(err, trip) {
			if (err) {
				logger.error(err, {line: 253});
				
				res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
					.json({error: err});
					
				return;
			}

			res.type('json')
				.json({trip: trip});
		});
	});
});

router.get('/:id', mdlwares.renderIndexUnlessXhr, function(req, res, next) {
	
	Trip.findById(req.params.id).populate('user').exec(function(err, trip) {
		if (err) {
			logger.error(err, {line: 271});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return
		}
		
		if (req.session.uid) {
			User.setReaded('newTrips', req.session.uid, trip.id);			
		}
		
		if (!req.session.uid || !trip) {
			res.type('json')
				.json({trip: trip});

			return;				
		}
		
		if (trip.user.id === req.session.uid) { // my trip
			Order.find({
				trip: trip._id,
				tripUser: req.session.uid
			}).sort('status -created_at').populate('user').exec(function(err, orders) {
				if (err) {
					logger.error(err, {line: 297});
					
					res.status(500).type('json')
						.json({error: 'Unexpected server error.'});
						
					return
				}
				
				res.type('json').json({
					trip: trip,
					orders: orders
				});
			});		
		} else {
			Subscribe.findOne({
				from_id: trip.from_id,
				to_id: trip.to_id,
				is_unsubed: false,
				user: req.session.uid
			}).select('_id').exec(function(err, subscribe) {
				if (err) {
					logger.error(err, {line: 318});
					
					res.status(500).type('json')
						.json({error: 'Unexpected server error.'});
						
					return;
				}
				
				res.type('json').json({
					trip: trip,
					subscribe: subscribe
				});
			});
		}

	});
});




/*
router.get('/add', function(req, res, next) {
	res.render('trips/add');
});*/


/*router.get('/edit/:id', function(req, res, next) {	
	Trip.findById(req.params.id, function(err, trip) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		if (!trip) {
			res.status(404);
		}
		
		// res.type('json')
			// .json({trips: trip});
			
		res.render('trips/add', { trip: trip });  
		
	  // console.log('%s --- %s.', trips.name, trips.from)
	  // res.render('index', { title:trips[1].to + trips[0].from });
	});
});*/

// переделать на PUT
/*router.post('/edit/:id', function(req, res, next) {	
	 // if (req.body.when) {
		// req.body.when += ' 23:59:59'		
	// } 
	
	
	Trip.findOne({
		_id: req.params.id
	}, function(err, trip) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		if (!trip) {
			res.status(404);
		}		
		
		trip.description = trip.description + '<hr />' + trip.dateFormat(new Date(), true) + '<hr />' + req.body.description.replace(/<hr \/>/g, '');

		trip.save(function(err, trip) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return
			}
			
			
			res.redirect('/trips');
		});
		
		return
		// trip.
		
		Model.findOneAndUpdate(query, { name: 'jason borne' }, options, callback)
		
		// res.type('json')
			// .json({trips: trip});
			
		// res.render('trips/add', { trip: trip });  
		
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
		
		
	});
	
	
	return;
	
	Trip.findOneAndUpdate({
		_id: req.params.id
	}, req.body).exec(function(err, trip) {
		if (err) {
			res.status(err.name == 'ValidationError' ? 400 : 500);
			
			res.type('json')
				.json({error: err});
				
			return
		}
		
		if (!trip) {
			res.status(404);
		}
		
		res.redirect('/');
	});
	
	return 
	
	Trip.find({
		_id: req.params.id
	}, function(err, trip) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		if (!trip) {
			res.status(404);
		}
		
		
		Model.findOneAndUpdate(query, { name: 'jason borne' }, options, callback)
		
		// res.type('json')
			// .json({trips: trip});
			
		// res.render('trips/add', { trip: trip });  
		
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
		
		
	});
});
*/

// переделать на DELETE 
/*router.get('/del/:id', function(req, res, next) {
	Trip.findOne({
		_id: req.params.id
	}, function(err, trip) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
		
		if (!trip) {
			res.status(404);
		}
		
		trip.is_removed = true;

		trip.save(function(err, trip) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			res.redirect('/trips');
		});
		
	});
});
*/
/*router.post('/comments/add', function(req, res, next) {		
	req.body.user = req.session.uid;

	console.dir(req.body);
	
	Trip.findByIdAndUpdate(
        req.body.trip_id,
        {
			$push: {
				comments: req.body
			}
		},
		// {new: true},
        function(err, trip) {
			if (err) {
				res.status(err.name == 'ValidationError' ? 400 : 500)				
				
				res.type('json')
					.json({error: err});
					
				return;
			}
			
			res.redirect('/trips/' + req.body.trip_id);
        }
    );  
});*/

module.exports = router;