var express = require('express');
var router = express.Router();
var async = require('async');

var Trip = require('../models/trip');
var Message = require('../models/message');
var Order = require('../models/order');
var User = require('../models/user');

var ObjectId = require('mongoose').Types.ObjectId;
 

router.get('/', function(req, res, next) {	

	if (!req.xhr) {
		res.render('index');

		return;
	}
	
	if (!req.session.uid) {
		res.status(401).json({error: 'Unauthorized'});

		return;
	}



	async.parallel({
		orders: function(callback) {	
			Trip.find({
				user: ObjectId(req.session.uid),
				is_removed: false
			}).select({ _id: 1}).exec(function (err, trips) {
				if (err) {
					callback(err, trips);
						
					return;
				}
				
				var tids = trips.map(function(trip) {
					return ObjectId(trip._id);
				});
				
				Order.find({
					trip: {$in: tids}
				}).sort({
					created_at: -1
				})/*.populate('user')*/.exec(function (err, orders) {
					if (err) {
						callback(err, trips);
							
						return;
					}
					
					callback(err, orders);
				});
			});		
		},
		myOrders: function(callback){
			Order.find({
				user: ObjectId(req.session.uid)
			}, function (err, orders) {
				if (err) {
					callback(err, orders);
					
					return;
				}
				
				callback(err, orders);
			});
		}
	}, function(err, asyncRes){
		// can use res.team and res.games as you wish
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		var orders = asyncRes.orders.concat(asyncRes.myOrders);
		
		Order.populate(orders, {path: 'user trip'}, function(err, orders) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			/*
			res.type('json').json({
				orders: orders
			});return;
			*/
			
			var tripUids = orders.map(function(order) {
				return ObjectId(order.trip.user);
			});
			
			
// console.log('tripUidstripUidstripUidstripUidstripUids');
// console.dir(tripUids);
			
			User.find({
				_id: {$in: tripUids}
			}).exec(function (err, users) {
				if (err) {
					res.status(500)
						.type('json')
						.json({error: err});
						
					return;
				}
				
				var usersIndex = {};
				
				users.forEach(function(user) {					
					usersIndex[user._id] = user
				});

				orders.forEach(function(order) {
					order.trip.user = usersIndex[order.trip.user];
				});
				
				res.type('json').json({
					orders: orders
				});
			});
		});	
	});
	
	
	


	
	

	
	
	
	
	
	
});

router.get('/my', function(req, res, next) {
	if (!req.xhr) {
		res.render('index');

		return;
	}
	
	if (!req.session.uid) {
		res.status(401).json({error: 'Unauthorized'});

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

	var order = new Order({
		user: req.session.uid,
		trip: req.body.trip,
		status: 0,
		message: req.body.message
	});

	order.save(function(err, order) {
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
	
	/*Trip.findByIdAndUpdate(
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
	
	  */
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


























