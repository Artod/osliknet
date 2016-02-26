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
	
	Trip.find({
		user: ObjectId(req.session.uid)/*,
		is_removed: false*/
	}).select({ _id: 1}).exec(function(err, trips) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
		
		var tids = trips.map(function(trip) {
			return trip.id;
		});
		
		Order.find({
			$or: [{
				trip: {$in: tids}
			}, {
				user: ObjectId(req.session.uid)
			}]			
		}).sort({
			status: 1,
			created_at: -1
		}).populate('user trip').exec(function(err, orders) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			var tripUids = [];
			
			orders.forEach(function(order) {
				var uid = order.trip.user.toString();
				
				if (tripUids.indexOf(uid) === -1) {
					tripUids.push(uid);
				}
			});
			
			// console.log(tripUids.length);
			// console.dir(tripUids);
			
			/*
			var _tripUids = [];
			var tripUids = orders.filter(function(order) {
				_tripUids.push( order.trip.user.toString() );
				return order.trip.user;
				// return ObjectId(order.trip.user);
				
				blockedTile.indexOf("118") != -1
			});*/
			
			User.find({
				_id: {$in: tripUids} // можно дублировать все равно вернет уникальных юзеров
			}).select('name gravatar_hash').exec(function(err, users) {
				if (err) {
					res.status(500)
						.type('json')
						.json({error: err});
						
					return;
				}
				
				var usersIndex = {};
				
				users.forEach(function(user) {				
					usersIndex[user.id] = user
				});

				orders.forEach(function(order) {
					if (order.trip.user instanceof ObjectId) { // заполняет другие user магией если одинаковые uid
						order.trip.user = usersIndex[ order.trip.user.toString() ];
					}
				});
				
				User.setOrderReaded(req.session.uid);
				
				res.type('json').json({
					orders: orders
				});
			});
		});
	});

	
	return;
	

	async.parallel({
		orders: function(callback) {	
			Trip.find({
				user: ObjectId(req.session.uid),
				is_removed: false
			}).select({ _id: 1}).exec(function(err, trips) {
				if (err) {
					callback(err, trips);
						
					return;
				}
				
				var tids = trips.map(function(trip) {
					return trip._id;
				});
				
				Order.find({
					trip: {$in: tids}
				}).sort({
					created_at: -1
				})/*.populate('user')*/.exec(function(err, orders) {
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
		status: 5,
		message: req.body.message
	});

	order.save(function(err, order) {
		if (err) {
			res.status(err.name === 'ValidationError' ? 400 : 500);
			
			res.type('json')
				.json({error: err});
				
			return;
		}
		
		Trip.findById(req.body.trip).select('user').exec(function(error, trip) {
			User.setOrderUnreaded(trip.user, order.id);
		});
		
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

router.post('/status', function(req, res, next) {
	var newStatus = Number(req.body.status);
	
	Order.findById(req.body.order).populate('trip').exec(function(err, order) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}

		if (!order) {
			res.status(400)
				.type('json')
				.json({error: 'Order not found'});
				
			return;
		}
		
		if (order.status === newStatus) {
			res.type('json')
				.json({order: order});
				
			return;
		}
		
		var orderUser = order.user.toString(),
			tripUser = order.trip.user.toString();

		if (req.session.uid !== orderUser && req.session.uid !== tripUser) {
			res.status(401).type('json').json({error: 'Unauthorized'});

			return;
		}
		
		var checkAndSave = function(canAfterCurrent) {
			var isTripPassed = ( new Date(order.trip.when) ) < ( new Date() );
			
			if (
				order.status !== canAfterCurrent || 
				( newStatus === sts.FINISHED && !isTripPassed ) || // finish before trip
				( isTripPassed && [sts.REFUSED, sts.CANCELLED, sts.FINISHED].indexOf(newStatus) === -1 ) // refus cancel and finish always		
			) {
				res.status(401).type('json').json({error: 'Unauthorized'});

				return;
			}

			var oldStatus = order.status;
			order.status = newStatus;
			order.save(function(err, order) {
				if (err) {
					res.status(500).type('json')
						.json({error: err});
						
					return;
				}

				var message = new Message({
					order: order.id,
					user: req.session.uid,
					message: 'I changed the order status from ' + res.locals.orderStatus[oldStatus] + ' to ' + res.locals.orderStatus[newStatus] + '.'
				});		
				
				message.save(function(err, message) {
					if (err) {
						// log error							
						return;
					}

					User.setMessagesUnreaded(req.session.uid !== orderUser ? orderUser : tripUser, order.id);
				});				
				
				res.type('json')
					.json({order: order});
			});
		};
		
		var sts = Order.sts;
		
		if (req.session.uid === orderUser) {
			switch(newStatus) {
				case sts.NEGOTIATION:
					checkAndSave(sts.CANCELLED);
					
					return;
				case sts.CANCELLED:
					checkAndSave(sts.NEGOTIATION);
				
					return;
			}			
		} else if (req.session.uid === tripUser) {
			switch(newStatus) {
				case sts.NEGOTIATION:
					checkAndSave(sts.REFUSED);
					
					return;
				case sts.PROCESSING:
					checkAndSave(sts.NEGOTIATION);
					
					return;
				case sts.REFUSED:
					checkAndSave(sts.NEGOTIATION);
					
					return;
				case sts.FINISHED:
					checkAndSave(sts.PROCESSING);
				
					return;
			}
		}
		
		res.status(401).json({error: 'Unauthorized'});

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


























