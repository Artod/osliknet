var express = require('express');
var router = express.Router();

var mdlwares = require('../libs/mdlwares');

var Trip = require('../models/trip');
var Order = require('../models/order');
var User = require('../models/user');
var Message = require('../models/message');
var Review = require('../models/review');

var winston = require('winston');
var path = require('path');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, '../logs/reviews.log')
		})
    ],
	exitOnError: false
});

router.get('/', mdlwares.restricted, function(req, res, next) {
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
			logger.error(err, {line: 36});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
	
		res.type('json')
			.json({reviews: reviews});
	});
});

router.post('/add', mdlwares.restricted, mdlwares.checkOrderAccess, function(req, res, next) {
	var order = res.order;
	
	var orderUser = order.user.toString(),
		tripUser = order.trip.user.toString(); //order.tripUser
	
	Review.findOne({
		order: order._id,
		user: req.session.uid
	}).exec(function(err, review) {
		if (err) {
			logger.error(err, {line: 81});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
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
				logger.error(err, {line: 105});
				
				res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}
			
			Message.addToOrder(order, {
				order: order._id,
				user: review.user,
				corr: review.corr,
				message: 'I ' + (wasNew ? 'have just written a' : 'have just changed the') + ' review.'
			}, function(err, message) {
				if (err) {
					logger.error(err, {line: 120});
					
					return;
				}
			});			
			
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
				if (err) {
					logger.error(err, {line: 155});
						
					return;
				}
				
				var rate = [0, 0, 0, 0, 0];
				
				docs.forEach(function(doc) {
					rate[doc._id - 1] = doc.count;
				});

				User.stats(review.corr, review.isUserTripper ? 'r_rate' : 't_rate', rate);	
			});
			
			res.type('json')
				.json({review: review});
		});
	});

});

router.get('/order/:order_id', mdlwares.restricted, function(req, res, next) {
	Review.findOne({
		order: req.params.order_id,
		user: req.session.uid
	}).exec(function(err, review) {
		if (err) {
			logger.error(err, {line: 183});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
	
		res.type('json')
			.json({review: review});
	});
});

module.exports = router;

























