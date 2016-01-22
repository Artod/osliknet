var express = require('express');


var router = express.Router();

var passwordless = require('passwordless');


var User = require('../models/user');
var Token = require('../models/token');












/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});





router.get('/logout', passwordless.logout(/*{successFlash: 'Hope to see you soon!'}*/), function(req, res) {
	/*delete req.session.uid;
	delete req.session.name;
	delete req.session.email;
	*/
	
	req.session.destroy(function(err) {
	  // cannot access session here
	});
	
	res.render('index', {
		session: JSON.stringify(req.session)
	});
});


function proceedEmail(callback) {
	return function (req, res, next) {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
		
		if ( !re.test(req.body.email) ) {
			res.status(400)			
				.type('json')
				.json({error: 'Invalide email'});
				
			return;
		}
		
		User.findOne({
			email: req.body.email.toLowerCase()
		}, function(err, user) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return
			}
			
			callback(user, req, res, next);
		});
	}
}

/* POST login details. */
router.post('/signup', function(req, res, next) {
	// не убирать отсюда
	if ( !/^[a-z0-9-_]+$/i.test(req.body.username) ) {
		res.status(400)	;			
		
		res.type('json')
			.json({error: 'Invalid user name'});
		
		return;		
	}
	
	User.findOne({
		name: new RegExp('^' + req.body.username + '$', 'i') // безопасно потому что до этого проверяем регекспом
	}, function(err, user) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		console.dir(user)
		
		if (user) {
			res.status(400);			
		
			res.type('json')
				.json({error: 'Username is occupied.'});
		} else {
			next();
		}
	});
}, proceedEmail(function(user, req, res, next) {
	if (user) {
		res.status(400)	
			.type('json')
			.json({error: 'Email is registered already.'});
	} else {	
		var user = new User({
			name: req.body.username,
			email: req.body.email		
		});
		
		user.save(function(err, user) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return
			}
				
			req.userId = user.id;
			
			next();
		});
	}
}), passwordless.requestToken(function(email, delivery, callback, req) {
	callback(null, req.userId);
}, {
	//failureRedirect: '/failureRedirecsendtokent111',
	userField: 'email'
 }), function(req, res) { // файлуре срабатывает сук
	// success!
	res.render('index', { message: 'sent', session: JSON.stringify(req.session) });
});



function loggedInAlready(req, res, next) {
	if (req.session.passwordless) {
		res.type('json')
			.json({message: 'Logged in already.'});
	} else {
		next();
	}
}


/* POST login details. */
router.post('/login', loggedInAlready, proceedEmail(function(user, req, res, next) {
	if (user) {
		req.userId = user.id;
		next();
	} else {
		res.status(400)
			.type('json')
			.json({error: 'Email not found.'});
	}
}), function(req, res, next) {
	console.log(req.uid);
	console.log( req.app.get('passwordlessTTL') );

	Token.findOne({
		uid: req.userId
	}, 'ttl', function(err, token) {
		if (err) {
			res.status(500)
				.type('json')
				.json({error: err});
				
			return
		}
		
		
		if (!token || !token.ttl) {
			next();
			
			return;
		}
		
		var now = new Date().getTime();		
		var lastTokenTime = ( now - token.ttl.getTime() + req.app.get('passwordlessTTL') );
		
		console.log('token old')
		console.log(lastTokenTime);
		
		if (lastTokenTime < 1000 * 30) {
			res.status(429)
				.type('json')
				.json({error: 'We have already sent you a link to access. The new token can be sent only after 30 seconds.'});
		} else {
			next();

			return;
		}
	});	
	
}, passwordless.requestToken(function(email, delivery, callback, req) {
	callback(null, req.userId);
}, {
	// failureRedirect: '/failureRedirecsendtokent2222',
	userField: 'email'
}), function(req, res) {
	// success!
	res.render('index', { message: 'sent', session: JSON.stringify(req.session) });
});


router.get('/logged_in', loggedInAlready, passwordless.acceptToken({
	// successRedirect: '/', //'/если норм залогинелся редиректит сюда',
	//enableOriginRedirect: true
}), function(req, res) {
	if (req.session.passwordless) {
		if (req.session.uid) {	
			res.render('index', {message: 'Welcommen', session: JSON.stringify(req.session)});
			
			return;
		}
		
		User.findById(req.session.passwordless, function(err, user) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return
			}
			
			req.session.uid = user.id;
			req.session.name = user.name;
			req.session.email = user.email;

			if (!user.is_approved) {
				user.is_approved = true;
console.log('save for approve');
				//
				user.save(function(err, user) {
					//LOG !!!!!!
					/*if (err) {
						res.status(500)
							.type('json')
							.json({error: err});
							
						return
					}*/
				});
			}	

			res.render('index', {message: 'Welcommen', session: JSON.stringify(req.session)});				
			
			return;
		});

		return;
	} else {
		res.render('index', {message: 'Возможно токен протух', session: JSON.stringify(req.session)});		
	}
});










module.exports = router;