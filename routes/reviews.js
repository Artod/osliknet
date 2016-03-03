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

router.get('/', function(req, res, next) {
	var limit = Number(req.query.limit);	
	limit = (limit && limit < 30 ? limit : 30);
	
	var page = Number(req.query.page) || 0;
	
	Review.find({
		$or: [{
			user: req.session.uid
		}, {
			corr: req.session.uid
		}]
	}).sort('-_id').skip(page * limit).limit(limit).populate('user corr').exec(function(err, reviews) {
		if (err) {
			res.status(500).type('json')
				.json({error: err});
				
			return;
		}
	
		res.type('json')
			.json({reviews: reviews});
	});
});

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
			
			review.order = order._id;
			review.user = req.session.uid;
			review.isUserTripper = (req.session.uid === tripUser);
			review.corr = (req.session.uid !== orderUser ? orderUser : tripUser);
			review.rating = (req.body.rating && [1, 2, 3, 4, 5].indexOf( Number(req.body.rating) ) > -1 ? req.body.rating : 5);
			review.comment = req.body.comment;
			
			review.save(function(err, review) {
				if (err) {
					res.status(err.name === 'ValidationError' ? 400 : 500);					
					res.type('json')
						.json({error: err});
						
					return;
				}
				
				Message.addToOrder(order, {
					order: order._id,
					user: review.user,
					corr: review.corr,
					message: 'I ' + (wasNew ? 'have just written a' : 'have just changed the') + ' #review.'
				}, function(err, message) {
					if (err) {// log error							
						return;
					}
				});
				
				/*var message = new Message({
					order: order._id,
					user: review.user,
					corr: review.corr,
					message: 'I ' + (wasNew ? 'have just written a' : 'have just changed the') + ' review.'
				});		
				
				message.save(function(err, message) {
					if (err) {// log error							
						return;
					}

					User.setMessagesUnreaded(review.corr, order.id, message.id);
				});*/
				
				
				Review.aggregate([{
					$match: {
						isUserTripper: review.isUserTripper,
						corr: review.corr
					}
				}, {
					$group: {
						_id: "$rating",
						count: { $sum : 1 }/*,
						totalRating: { $sum: "$rating" }*/
					}
				}]).exec(function(err, docs) {
console.log('docsdocsdocsdocsdocsdocsdocsdocsdocs');
console.dir(docs);
					if (err) {
						//log
							
						return;
					}
					
					var rate = [0, 0, 0, 0, 0];
					
					docs.forEach(function(doc) {
						rate[doc._id - 1] = doc.count;
					});
console.log('raterateraterateraterateraterate');
console.dir(rate);
					User.stats(review.corr, review.isUserTripper ? 'r_rate' : 't_rate', rate);	
				});
				
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

























