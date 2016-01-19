var express = require('express');
var router = express.Router();

var Order = require('../models/order');


/* GET home page. */
router.get('/', function(req, res, next) {	
	Order.find({
		
	}, function (err, orders) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
		}
		
		res.render('orders/index', {
			orders:orders,
			session: JSON.stringify(req.session)
		});
		
		// res.type('json')
			// .json({trips: trips});
			
		// console.log('%s --- %s.', trips.name, trips.from)
		// res.render('index', { title:trips[1].to + trips[0].from });
	});  
});

router.get('/:id', function(req, res, next) {	
	Order.findOne({
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
		
	});  
});


router.post('/add', function(req, res, next) {
	req.body.messages = req.body.messages || {};	
	req.body.messages.uid = req.session.uid
	req.body.uid = req.session.uid;
	req.body.status = 0;
	
	var order = new Order(req.body);	
	
	order.save(function (err, order) {
		if (err) {
			res.status(err.name === 'ValidationError' ? 400 : 500);
			
			res.type('json')
				.json({error: err});
				
			return;
		}

		res.redirect('/trips/' + req.body.trip_id);

	});  
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



























