var express = require('express');
var router = express.Router();
var async = require('async');

var Trip = require('../models/trip');
var Message = require('../models/message');
var Order = require('../models/order');

var ObjectId = require('mongoose').Types.ObjectId;

router.get('/last/:lastMid', function(req, res, next) {	
	if (!req.xhr) {
		res.render('index');

		return;
	}
	

	console.log('req.params.lastMid = ', req.params.lastMid);
	
	Message.findById(req.params.lastMid).populate('order').exec(function(err, message) {			
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		Trip.findById(message.order.trip).exec(function(err, trip) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}			
			
			if (message.order.user.toString() !== req.session.uid && trip.user.toString() !== req.session.uid) {
				res.status(401)
					.type('json')
					.json({error: 'Unauthorized'});
					
				return;
			}
			
			Message.find({
				_id: { $gt: ObjectId(req.params.lastMid) },
				order: ObjectId(message.order._id)
			}).sort({
				created_at: 1
			}).populate('user').exec(function (err, messages) {			
				if (err) {
					res.status(500)
						.type('json')
						.json({error: err});
						
					return
				}
				
				res.type('json').json({messages: messages});
			});

		});

		// Message.populate(message, {path: 'order.trip'}, )
		
	});
	
	return;

	

});

router.get('/order/:id', function(req, res, next) {	
	if (!req.xhr) {
		res.render('index');

		return;
	}
	
	async.parallel({
		order: function(callback) {
			Order.findById(req.params.id)
				.populate('user trip')
				.exec(function (err, order) {
					Trip.populate(order.trip, {path: 'user'}, function(err, trip) {
						if (err) {
							callback(err, order);
							
							return;
						}

						callback(err, order);
					});
					// callback(err, order);
				});		
		},
		messages: function(callback){
			Message.find({order: req.params.id})
				.sort({created_at: 1})
				.populate('user')
				.exec(function (err, messages) {
					callback(err, messages);
				});
		},                    
	}, function(err, asyncRes) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		res.type('json').json(asyncRes);		
	});
	
	
	return;
	
	Message.find({order: req.params.id})
		.sort({created_at: 1})
		.populate('user')
		.exec(function (err, messages) {

			
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return
			}
			
			res.type('json').json({messages: messages});
		});
		
		
	return;
	
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
				.sort({created_at: 1})
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
	
	
	/*
	todo 
	
	check if user can save message with this order_id
	*/
if (!req.session.uid) {
	res.status(401);

	return;
}
	
	req.body.user = req.session.uid;
	
	var message = new Message(req.body);	
	
	message.save(function(err, message) {
		if (err) {
			res.status(err.name == 'ValidationError' ? 400 : 500)				
			
			res.type('json')
				.json({error: err});
				
			return;
		}
		
		res.type('json')
			.json({message: message});
	});
});



module.exports = router;



/*
{"error":{"name":"MongoError","message":"exception: bad query: BadValue unknown top level operator: $orders
.uid","errmsg":"exception: bad query: BadValue unknown top level operator: $orders.uid","code":16810
,"ok":0}}
*/


























