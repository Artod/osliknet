var express = require('express');
var router = express.Router();
var async = require('async');

var Trip = require('../models/trip');
var Message = require('../models/message');
// var Order = require('../models/order');

var ObjectId = require('mongoose').Types.ObjectId;

/* GET home page. 
router.get('/', function(req, res, next) {	
	Order.find({
		
	}, function (err, orders) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
		}
		
		res.render('orders/index', {
			orders: orders,
			session: JSON.stringify(req.session)
		});
		
		// res.type('json')
			// .json({trips: trips});
			
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
	});  
});*/

router.get('/my', function(req, res, next) {
	if (!req.xhr) {
		res.render('index');

		return;
	}
	
	if (!req.session.uid) {
		res.status(401);

		return;
	}

	/*
	.find({
		'orders.uid': mongoose.Types.ObjectId(req.session.uid)
	}).select({'orders.$': 1}).populate('uid')
	*/

	/*
	aggregate([
	{
		$match: {
            'orders.uid': mongoose.Types.ObjectId(req.session.uid)/*;
			'orders': { 
               '$elemMatch': { 
                   "uid": req.session.uid
				}
			}
        }
	}, {
		$unwind: "$orders"
	}]).
	*/

	Trip.aggregate([{
		$match: {
            'orders.user': ObjectId(req.session.uid)
        }
	}, {
		$unwind: "$orders"
	}, {
		$match: {
            'orders.user': ObjectId(req.session.uid)
        }
	}, {
		$sort : {
			'orders.status': 1,
			'orders.created_at' : -1
		}
	}]).exec(function(err, trips) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
		
		// var res = {}
		
		/*var out = trips.map(function(trip) {	
			var order = trip.orders.id();
			
			return {
				
			};			
		});*/
		
		Trip.populate(trips, {path: 'user'}, function(err, trips) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			res.type('json')
				.json({trips: trips});
		});
		
		// res.type('json')
			// .json({trips: trips});
		
		// res.render('orders/index', {
			// orders:orders,
			// session: JSON.stringify(req.session)
		// });
			
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
	});
});

router.get('/:id', function(req, res, next) {	
	if (!req.xhr) {
		res.render('index');

		return;
	}
	
	async.parallel({
		trip: function(callback) {	
			Trip.aggregate([{
				$match: {
					'orders._id': ObjectId(req.params.id)
				}
			}, {
				$unwind: "$orders"
			}, {
				$match: {
					'orders._id': ObjectId(req.params.id)
				}
			}]).exec(function(err, trips) {
				if (err) {
					callback(err, trips);
					
					return;
				}
				
				Trip.populate(trips, {path: 'user orders.user'}, function(err, trips) {
					if (err) {
						callback(err, trips);
						
						return;
					}

					callback(err, trips[0]);
				});
			});			
		},
		messages: function(callback){
			Message.find({order: req.params.id})
				.sort({created_at: -1})
				.populate('user')
				.exec(function (err, messages) {
					callback(err, messages);
				});
		},                    
	}, function(err, asyncRes){
		// can use res.team and res.games as you wish
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		res.type('json').json(asyncRes);		
	});
	

	
	
	

	/*Order.findOne({
		_id: req.params.id
	}, function(err, order) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}

		res.render('orders/one', {
			order:order,
			session: JSON.stringify(req.session)
		});
		
	});  */
});


router.post('/add', function(req, res, next) {
	/**
		TODO:
		- send email to traveler
		- inc order counter
	*/
	
	
	// req.body.messages = req.body.messages || {};	

	
	var order = {
		user: req.session.uid,
		status: 0,
		message: req.body.message,
		created_at: new Date(),
		updated_at: new Date()
		/*
		messages: [{
			user: req.session.uid,
			message: req.body.message
		}]*/
	};	
	
	Trip.findByIdAndUpdate(
        req.body.trip_id, {
			$push: {
				orders: order
			}
		},
		// {new: true},
        function(err, oldTrip) {
			if (err) {
				res.status(err.name == 'ValidationError' ? 400 : 500);			
				
				res.type('json')
					.json({error: err});
					
				return;
			}
			
			res.type('json')
				.json({});
        }
    );
	
	/*
	Trip.find({
		uid: req.body.trip_id
	}).exec(function (err, order) {
		if (err) {
			res.status(err.name === 'ValidationError' ? 400 : 500);
			
			res.type('json')
				.json({error: err});
				
			return;
		}
		
		res.type('json')
			.json({order: order});

		// res.redirect('/trips/' + req.body.trip_id);

	});
	
	var order = new Order(req.body);	
	
	order.save(function (err, order) {
		if (err) {
			res.status(err.name === 'ValidationError' ? 400 : 500);
			
			res.type('json')
				.json({error: err});
				
			return;
		}
		
		res.type('json')
			.json({order: order});

		// res.redirect('/trips/' + req.body.trip_id);

	});  */
});


router.post('/messages/add', function(req, res, next) {	
	var messages =  req.body.messages || {};
	messages.uid = req.session.uid

	// console.dir(req.body);
	
	Order.findByIdAndUpdate(
        req.body.order_id,
        {
			$push: {
				messages: messages
			}
		},
		// {new: true},
        function(err, order) {
			if (err) {
				res.status(err.name == 'ValidationError' ? 400 : 500);			
				
				res.type('json')
					.json({error: err});
					
				return;
			}
			
			res.redirect('/orders/' + req.body.order_id);
        }
    ); 
});


module.exports = router;



/*
{"error":{"name":"MongoError","message":"exception: bad query: BadValue unknown top level operator: $orders
.uid","errmsg":"exception: bad query: BadValue unknown top level operator: $orders.uid","code":16810
,"ok":0}}
*/


























