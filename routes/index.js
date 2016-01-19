var express = require('express');
var router = express.Router();


var Trip = require('../models/trip');



/* GET home page. */
router.get('/', function(req, res, next) {
	
	console.dir(req.cookies)
	
	// console.log('sdsdsd')
	
	Trip.find(function (err, trips) {

		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
		}
		
		res.render('index', {
			title:trips,
			session: JSON.stringify(req.session)
		});
		
		// res.type('json')
			// .json({trips: trips});
			
	  // console.log('%s --- %s.', trips.name, trips.from)
	  // res.render('index', { title:trips[1].to + trips[0].from });
	});
  
});








module.exports = router;



























