var express = require('express');
var router = express.Router();
var async = require('async');

var mdlwares = require('../libs/mdlwares');

var Trip = require('../models/trip');
var Message = require('../models/message');
var Order = require('../models/order');
var User = require('../models/user');

var winston = require('winston');
var path = require('path');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, '../logs/messages.log')
		})
    ],
	exitOnError: false
});

router.get('/', mdlwares.restricted, mdlwares.renderIndexUnlessXhr, function(req, res, next) {
	
	Message.find({
		order: null,
		$or: [{
			user: req.session.uid
		}, {
			corr: req.session.uid
		}]
	}).distinct('user').distinct('corr').exec(function(err, users) {
		if (err) {
			logger.error(err, {line: 33});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				// .json({error: err});
				
			return;
		}
		
		/*users = users.map(function(user) {
			return user.toString();
		});*/
		
		User.find({
			_id: {$in: users}
		}).exec(function(err, users) {
			if (err) {
				logger.error(err, {line: 50});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					// .json({error: err});
					
				return;
			}
			
			res.type('json')
				.json({users: users});
		});
	});
});

router.get('/last/:lastId/order/:orderId', mdlwares.restricted, function(req, res, next) {
	// ? populate vs paralell
	Order.findById(req.params.orderId)./*populate('trip').*/exec(function(err, order) {			
		if (err) {
			logger.error(err, {line: 69});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				// .json({error: err});
				/*{"error":{"message":"Cast to ObjectId failed for value \"33\" at path \"_id\"","name":"CastError","kind":"ObjectId","value":"33","path":"_id"}}*/
			return;
		}		
		
		async.parallel({
			trip: function(callback) {
				Trip.findById(order.trip).exec(function(err, trip) {
					callback(err, trip);
				});			
			},
			messages: function(callback){
				var conds = {
					order: order._id
				};
				
				if (req.params.lastId != 0) {
					conds._id = { $gt: req.params.lastId }
				}
				
				Message.find(conds).sort({
					created_at: 1
				}).populate({
					path: 'user',
					select: 'name gravatar_hash'
				}).exec(function (err, messages) {	
					callback(err, messages);
				});
			},                    
		}, function(err, asyncRes) {
			if (err) {
				logger.error(err, {line: 104});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					// .json({error: err});
					
				return
			}
			
			if (req.session.uid !== order.user.toString() && req.session.uid !== asyncRes.trip.user.toString()) {
				res.status(401).type('json').json({error: 'Unauthorized'});
					
				return;
			}

			User.setMessagesReaded(req.session.uid, order.id);

			res.type('json').json({
				messages: asyncRes.messages,
				order: order
			});			
		});
		
	});
});

router.get('/last/:lastId/user/:corrId', mdlwares.restricted, function(req, res, next) {
	if (req.session.uid === req.params.corrId) {
		res.type('json').json({});
		
		return;
	}
	
	User.findById(req.params.corrId).exec(function(err, user) {
		if (err) {
			logger.error(err, {line: 139});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!user) {
			res.type('json').json({});
			
			return;
		}
		
		var conds = {
			order: null,
			$or: [{
				user: req.session.uid,
				corr: req.params.corrId
			}, {
				user: req.params.corrId,
				corr: req.session.uid
			}]
		};
		
		if (req.params.lastId != 0) {
			conds._id = { $gt: req.params.lastId }
		}

		Message.find(conds).populate('user').sort('created_at').exec(function(err, messages) {			
			if (err) {
				logger.error(err, {line: 170});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}
				
			User.setPrivMessagesReaded(req.session.uid, user.id);
			
			res.type('json').json({
				messages: messages
			});
		});
	});
});

router.get('/order/:id', mdlwares.restricted, mdlwares.renderIndexUnlessXhr, function(req, res, next) {

	async.parallel({
		order: function(callback) {
			Order.findById(req.params.id).populate({
				path: 'trip',
				populate: {
					path: 'user',
					model: 'User',
					select: 'name gravatar_hash'
				}
			}).populate({
				path: 'user',
				select: 'name gravatar_hash'
			}).exec(function(err, order) {			
				callback(err, order);
			});		
		},
		messages: function(callback){
			Message.find({order: req.params.id})
				.sort('created_at')
				.populate({
					path: 'user',
					select: 'name gravatar_hash'
				}).exec(function(err, messages) {
					callback(err, messages);
				});
		},
	}, function(err, asyncRes) {
		if (err) {
			logger.error(err, {line: 217});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return
		}
		
		if (req.session.uid !== asyncRes.order.user.id && req.session.uid !== asyncRes.order.trip.user.id) {
			res.status(401).type('json').json({error: 'Unauthorized'});
				
			return;
		}	

		User.setMessagesReaded(req.session.uid, asyncRes.order.id);
		
		res.type('json').json(asyncRes);		
	});
});

router.get('/user/:id', mdlwares.restricted, mdlwares.renderIndexUnlessXhr, function(req, res, next) {
	
	User.findById(req.params.id).exec(function(err, user) {
		if (err) {
			logger.error(err, {line: 241});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!user) {
			res.type('json').json({});
			
			return;
		}
		
		Message.find({
			order: null,
			$or: [{
				user: req.session.uid,
				corr: req.params.id
			}, {
				user: req.params.id,
				corr: req.session.uid
			}]
		}).populate('user').sort('created_at').exec(function(err, messages) {			
			if (err) {
				logger.error(err, {line: 266});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}

			User.setPrivMessagesReaded(req.session.uid, user.id);

			res.type('json').json({
				user: user,
				messages: messages
			});
			
		});
	});

});

router.post('/add', mdlwares.restricted, function(req, res, next) {
	if (!req.body.order && !req.body.corr) {
		res.status(400).type('json').json({});

		return;
	}
	
	if (req.body.order) {
		Order.findById(req.body.order).populate('trip').exec(function(err, order) {
			if (err) {
				logger.error(err, {line: 296});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}
			
			if (!order) {
				res.status(400).type('json').json({});; // bad request
					
				return;			
			}
			
			var orderUser = order.user.toString(),
				tripUser = order.trip.user.toString();
				
			if (req.session.uid !== orderUser && req.session.uid !== tripUser) {
				res.status(401).type('json').json({error: 'Unauthorized'});
				
				return;
			}
			
			var corr = (req.session.uid !== orderUser ? orderUser : tripUser);	
			
			Message.addToOrder(order, {
				order: order._id,
				user: req.session.uid,
				corr: corr,
				message: req.body.message
			}, function(err, message) {
				if (err) {
					logger.error(err, {line: 328});
					
					res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
						.json({error: 'Unexpected server error.'});
						
					return;
				}
				
				res.type('json')
					.json({message: message});
			});
		});
	} else {
		if (req.session.uid === req.body.corr) {
			res.status(400).type('json').json({error: 'Message to yourself.'});

			return;
		}
		
		User.findById(req.body.corr).exec(function(err, user) {
			if (err) {
				logger.error(err, {line: 349});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}
			
			if (!user) {
				res.status(400).type('json').json({});; // bad request
				
				return;
			}
			
			var message = new Message({
				user: req.session.uid,
				corr: user.id,
				message: req.body.message
			});		
			
			message.save(function(err, message) {
				if (err) {
					logger.error(err, {line: 371});
					
					res.status(err.name == 'ValidationError' ? 400 : 500).type('json')
						.json({error: 'Unexpected server error.'});
						
					return;
				}

				User.setPrivMessagesUnreaded(message.corr, message.user, message.id);
				
				res.type('json')
					.json({message: message});
			});
		});
	}
});

module.exports = router;

/*
{"error":{"name":"MongoError","message":"exception: bad query: BadValue unknown top level operator: $orders
.uid","errmsg":"exception: bad query: BadValue unknown top level operator: $orders.uid","code":16810
,"ok":0}}
*/


























