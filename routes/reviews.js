var express = require('express');
var router = express.Router();
/*var async = require('async');


var Message = require('../models/message');*/
var Trip = require('../models/trip');
var Order = require('../models/order');
var User = require('../models/user');

var Review = require('../models/review');

var ObjectId = require('mongoose').Types.ObjectId;

router.post('/add', function(req, res, next) {
	/*
	todo 
	
	check if user can save message with this order_id
	*/
	
if (!req.session.uid) {
	res.status(401);

	return;
}
	
	Order.findById(req.body.order)./*populate('trip').*/exec(function(err, order) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return;
		}
		
		var orderUser = order.user.toString()/*,
			tripUser = order.trip.user.toString()*/;
			
		if (req.session.uid !== orderUser/* && req.session.uid !== tripUser*/) {
			res.status(401)
				.type('json')
				.json({error: 'Unauthorized'});
			
			return;
		}
		
		Review.findOne({
			order: order._id,
			user: order.user
		}).exec(function(err, review) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			if (!review) {
				review = new Review();				
			}
		
			review.order = order._id;
			review.user = order.user;
			review.rating = req.body.rating;
			review.comment = req.body.comment;
			
			review.save(function(err, review) {
				if (err) {
					res.status(err.name == 'ValidationError' ? 400 : 500);
					
					res.type('json')
						.json({error: err});
						
					return;
				}
				
				//User.setMessagesUnreaded(req.session.uid !== orderUser ? orderUser : tripUser, order.id);
				
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

























