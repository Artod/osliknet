var express = require('express');

var router = express.Router();

var passwordless = require('passwordless');
var crypto = require('crypto');

var User = require('../models/user');
var Token = require('../models/token');


router.get('/notifications/:timestamp?', function(req, res, next) {
	User.findById(req.session.uid)
		.select('needEmailNotification newMessages newOrders newPrivMessages updated_at')
		.exec(function(err, user) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return
			}
			
			var out;
			
			if ( req.params.timestamp == user.updated_at.getTime() ) {
				out = {
					updated_at: user.updated_at
				};
			} else {
				out = {
					newMessages: user.newMessages,
					newOrders: user.newOrders,
					newPrivMessages: user.newPrivMessages,
					updated_at: user.updated_at
				};
			}
			
			if (user.needEmailNotification) {
				user.needEmailNotification = false;
console.log('needEmailNotification false save');
				user.save(function(err, user) {
					//log errors
console.log('needEmailNotification false save done');
					
					out.updated_at = user.updated_at;					
					res.type('json')
						.json(out);
				});
			} else {
				res.type('json')
					.json(out);
			}
		});
});

/*
User.find().exec(function(err, users) {	
	users.forEach(function(user) {
		user.gravatar_hash = crypto.createHash('md5').update(user.email).digest('hex');
		user.save();
	});
})*/

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
		}).exec(function(err, user) {
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
			res.status(400).type('json')
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
		req.body.email = req.body.email.trim().toLowerCase();
		
		var user = new User({
			name: req.body.username,
			email: req.body.email,
			gravatar_hash: require('crypto').createHash('md5').update(req.body.email).digest('hex')
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
router.post('/login', /*loggedInAlready, */proceedEmail(function(user, req, res, next) {
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
console.log('req.session.passwordless');
console.log(req.session.passwordless);
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
console.log('Welcommen')
console.dir(req.session)
			res.render('index', {message: 'Welcommen', session: JSON.stringify(req.session)});				
			
			return;
		});

		return;
	} else {
console.log('Возможно токен протух')
		res.render('index', {message: 'Возможно токен протух', session: JSON.stringify(req.session)});		
	}
});




router.get('/:id', function(req, res, next) {
	if (!req.xhr) {
		res.render('index');

		return;
	}
	
	User.findById(req.params.id)
		.select('created_at name gravatar_hash about')
		.exec(function(err, user) {
			if (err) {
				res.status(500)
					.type('json')
					.json({error: err});
					
				return;
			}
			
			res.type('json')
				.json({user: user});
		});
});





module.exports = router;
