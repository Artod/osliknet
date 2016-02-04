var express = require('express');
var router = express.Router();

var Trip = require('../models/trip');
var Order = require('../models/order');

var ObjectId = require('mongoose').Types.ObjectId;

router.get('/', function(req, res, next) {
	var query = {};
	
	if (req.query.from_id)
		query.from_id = req.query.from_id;
	
	if (req.query.to_id)
		query.to_id = req.query.to_id;
	
	console.dir(query)
	
	if (!query.from_id && !query.to_id) {
		res.type('json')
			.json([]);
			
		return;
	}
	
	query.when = { $gt: ( new Date() ).getTime() - 1000*60*60*24 },
	
	Trip.find(query).sort({created_at: -1}).exec(function (err, trips) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
		
		res.type('json')
			.json(trips);
			
		// res.render('trips/index', { trips: trips });
			
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
	});	
  
});

router.get('/my', function(req, res, next) {
	if (!req.xhr) {		
		res.render('index');
		return;
	}
	
if (!req.session.uid) {
	res.status(401);

	return;
}
	
	Trip.find({
		user: ObjectId(req.session.uid)
	}).exec(function (err, trips) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
		
		var tids = trips.map(function(trip) {
			return ObjectId(trip._id);
		});
		
		Order.find({
			trip: {$in: tids}
		}).exec(function (err, orders) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
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

router.get('/add', function(req, res, next) {
	res.render('trips/add');
});

router.post('/add', function(req, res, next) {
	// console.log(111111111111111111111111111111111111111111111111111)
	// console.log(req.body.when instanceof Number)
	// console.log(req.body.when instanceof String)
	// console.log(new Date(req.body.when))
	
	// res.render('index', { title: req });
	// return
	// console.dir(req.body);
	
	/*if (req.body.when) {
		req.body.when += ' 23:59:59'		
	}*/
	
	req.body.is_removed = false;	
	req.body.user = req.session.uid;
	
	var trip = new Trip(req.body);	
	
	trip.save(function (err, trip) {
		if (err) {
			res.status(err.name == 'ValidationError' ? 400 : 500)				
			
			res.type('json')
				.json({error: err});
				
			return;
		}
		
		 res.type('json')
				.json({trip: trip});
	});  
});

router.get('/:id', function(req, res, next) {	
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
			
		res.render('trips/one', { trip: trip });  
		
	  // console.log('%s --- %s.', trips.name, trips.from)
	  // res.render('index', { title:trips[1].to + trips[0].from });
	});
});

router.get('/edit/:id', function(req, res, next) {	
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
});

// переделать на PUT
router.post('/edit/:id', function(req, res, next) {	
	/* if (req.body.when) {
		req.body.when += ' 23:59:59'		
	} */
	
	
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

// переделать на DELETE 
router.get('/del/:id', function(req, res, next) {
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

router.post('/comments/add', function(req, res, next) {		
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
});

module.exports = router;