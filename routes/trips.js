var express = require('express');
var router = express.Router();

var Trip = require('../models/trip');

router.get('/', function(req, res, next) {
	console.dir({
		from_id: req.query.from_id,
		to_id: req.query.to_id
	})
	
	Trip.find({
		from_id: req.query.from_id,
		to_id: req.query.to_id
	}, function (err, trips) {

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
	req.body.uid = req.session.uid;
	
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
		
		/*Trip.find(function (err, trips) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
			}
			
			res.type('json')
				.json({trips: trips});
				
		  // console.log('%s --- %s.', trips.name, trips.from)
		  // res.render('index', { title:trips[1].to + trips[0].from });
		});*/
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
	req.body.uid = req.session.uid;

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