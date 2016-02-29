var express = require('express');
var router = express.Router();
/*var async = require('async');


var Message = require('../models/message');*/
var Trip = require('../models/trip');
var Order = require('../models/order');
var User = require('../models/user');
var Message = require('../models/message');

var Review = require('../models/review');

var ObjectId = require('mongoose').Types.ObjectId;

router.post('/add', function(req, res, next) {
	Order.findById(req.body.order).populate('trip').exec(function(err, order) {
		if (err) {
			res.status(500).type('json')
				.json({error: err});
				
			return;
		}
		
		if (!order) {
			res.status(400).type('json')
				.json({error: 'Order not found.'});
				
			return;
		}
		
		var orderUser = order.user.toString(),
			tripUser = order.trip.user.toString();
			
		if (req.session.uid !== orderUser && req.session.uid !== tripUser) {
			res.status(401)
				.type('json')
				.json({error: 'Unauthorized'});
			
			return;
		}
		
		Review.findOne({
			order: order._id,
			user: req.session.uid
		}).exec(function(err, review) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			var wasNew = false;
			if (!review) {
				wasNew = true;
				review = new Review();				
			}
			
			var oldRating = review.rating;
		
			review.order = order._id;
			review.user = req.session.uid;
			review.rating = req.body.rating < 0 ? -1 : 1;
			review.comment = req.body.comment;
			
			review.save(function(err, review) {
				if (err) {
					res.status(err.name === 'ValidationError' ? 400 : 500);
					
					res.type('json')
						.json({error: err});
						
					return;
				}
				
				var corr = (req.session.uid !== orderUser ? orderUser : tripUser);
				
				var message = new Message({
					order: order._id,
					user: req.session.uid,
					corr: corr,
					message: 'I ' + (wasNew ? 'have just written a' : 'have just changed the') + ' review.'
				});		
				
				message.save(function(err, message) {
					if (err) {// log error							
						return;
					}

					User.setMessagesUnreaded(corr, order.id, message.id);
				});
				
				User.stats( corr, req.session.uid === orderUser ? 't_rate' : 'r_rate', review.rating, (wasNew ? null : oldRating) );	
				
				res.type('json')
					.json({review: review});
			});
		});
	});

});

router.get('/order/:order_id', function(req, res, next) {
	Review.findOne({
		order: req.params.order_id,
		user: req.session.uid
	}).exec(function(err, review) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
	
		res.type('json')
			.json({review: review});
	});
});

module.exports = router;

























