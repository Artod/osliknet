var express = require('express');

var router = express.Router();

var winston = require('winston');
var path = require('path');

var mdlwares = require('../libs/mdlwares');
var passwordless = require('passwordless');
var crypto = require('crypto');
var config = require('../config');
var sendgrid  = require('sendgrid')(config.sendgrid.key);

var User = require('../models/user');
var Token = require('../models/token');
var Subscribe = require('../models/subscribe');
/*
var winston = require('winston');
var logger = new (winston.Logger)(
// {
    // transports: [
		// new (winston.transports.File)({ filename: '../logs/users.log', level: 'error' })
    // ]
// }
);

logger.log('fdfdfdfdffdfdfdfdffdfdfdfdffdfdfdfdffdfdfdfdf');
*/

var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, '../logs/users.log')
		})
    ],
	exitOnError: false
});



/*router.get('/sil/:uid', function(req, res) {
	if (req.session.uid === '5702b5d213e381b973f9a9f8') {
		User.findById(req.params.uid).select('+email').exec(function(err, user) {
			
			
			if (err || !user) {
				return;
			}
			
			req.session.uid = user.id;
			req.session.name = user.name;
			req.session.email = user.email;
			req.session.gravatar_hash = user.gravatar_hash;
			req.session.passwordless === req.session.uid;
			
			req.session.save(function(err) {
				console.log('loggedin as ' + user.name);
				res.redirect('/users/my');
			})

		});
	} else {
		res.redirect('/users/my');
	}
});*/

//logger.error(err, {line: 1});

router.get('/notifications/:timestamp?', mdlwares.restricted, function(req, res, next) {
	User.findById(req.session.uid)
		.select('needEmailNotification newOrders newTrips newMessages newPrivMessages updated_at')
		.exec(function(err, user) {
			if (err || !user) {
				logger.error(err, req.session, {line: 47});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return
			}
			
			var out = {
				updated_at: user.updated_at
			};
	
			if ( Number(req.params.timestamp) !== user.updated_at.getTime() ) {
				out.newOrders = user.newOrders;
				out.newTrips = user.newTrips;
				out.newMessages = user.newMessages;
				out.newPrivMessages = user.newPrivMessages;
			}

			if (user.needEmailNotification) {
				user.needEmailNotification = false;

				user.save(function(err, user) {
					//log errors without return!!!
					
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

router.get('/logout', mdlwares.restricted, passwordless.logout(), function(req, res) {
	res.locals.user = {};
	
	req.session.destroy(function(err) {
	  // cannot access session here
	});
	
	res.redirect('/trips');
});

function proceedEmail(callback) {
	return function (req, res, next) {
		var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;

		if ( !re.test(req.body.email) ) {
			res.status(400).type('json')
				.json({error: 'Invalide email'});
				
			return;
		}
		
		User.findOne({
			email: req.body.email.toLowerCase()
		}).select('email').exec(function(err, user) {
			if (err) {
				logger.error(err, {line: 109});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return
			}
			
			callback(user, req, res, next);
		});
	}
}

router.post('/signup', mdlwares.checkCaptcha, function(req, res, next) {
	req.body.username = req.body.name.trim();
	
	if ( !/^[a-z0-9-_ \.]+$/i.test(req.body.username) ) {
		res.status(400).type('json')
			.json({error: 'Invalid user name.'});
		
		return;		
	}
	
	User.findOne({
		name: new RegExp('^' + req.body.username + '$', 'i') 
	}).select('name').exec(function(err, user) {
		if (err) {
			res.status(500).type('json')
				.json({error: 'Username is occupied.'});
				// .json({error: err});
				
			return
		}
		
		if (user) {
			res.status(400).type('json')
				.json({error: 'Username is occupied.'});
		} else {
			next();
		}
	});
}, proceedEmail(function(user, req, res, next) {
	if (user) {
		res.status(400).type('json')
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
				logger.error(err, {line: 164});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return
			}
				
			req.userId = user.id;
			
			next();
		});
	}
}), passwordless.requestToken(function(email, delivery, callback, req) {
	callback(null, req.userId);
}, {
	userField: 'email'
 }), deliveryToken);

function deliveryToken(req, res, next) {
	if (!req.passwordless || !req.passwordless.tokenToSend || !req.passwordless.uidToSend || !req.passwordless.recipient) {
		
		logger.error(req.passwordless, {line: 186});
		
		res.status(500).type('json')
			.json({error: 'Unexpected server error.'});
			
		return;
	}
	
	var link = config.host + 'users/logged_in?token=' + req.passwordless.tokenToSend + '&uid=' + encodeURIComponent(req.passwordless.uidToSend);

	var email = new sendgrid.Email();
	
	email.addTo(req.passwordless.recipient);
	email.setFromName(config.name);
	email.subject = 'Token for ' + config.name;
	email.from = config.email;
	email.text = 'Hello! \n You can now access your account here: ' + link + '\n Team ' + config.name;
	email.html = '<h2>Hello!</h2> <p>You can now access your account here: <a href="' + link + '">' + link + '</a></p><p>Team ' + config.name + '</p>';

	sendgrid.send(email, function(err, json) {
		if (err) {
			logger.error(err, {line: 208});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
			
			return;
		}
		
		res.type('json').json({msg: 'sent'});
	});
}

router.post('/login', /*loggedInAlready, */proceedEmail(function(user, req, res, next) {
	if (user) {
		req.userId = user.id;
		
		next();
	} else {
		res.status(400).type('json')
			.json({error: 'Email not found.'});
	}
}), function(req, res, next) {
	
	Token.findOne({
		uid: req.userId
	}, 'ttl', function(err, token) {
		if (err) {
			logger.error(err, {line: 235});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return
		}
		
		if (!token || !token.ttl) {
			next();
			
			return;
		}
		
		var now = new Date().getTime();		
		var lastTokenTime = ( now - token.ttl.getTime() + config.passwordless.ttl );
		
		if (lastTokenTime < 1000 * 30) {
			res.status(429).type('json') //429 Too Many Requests
				.json({error: 'We have already sent you a link to access. The new token can be sent only after 30 seconds.'});
		} else {
			next();

			return;
		}
	});	
	
}, passwordless.requestToken(function(email, delivery, callback, req) {
		callback(null, req.userId);
	}, {
		userField: 'email'
	}
), deliveryToken);

router.get('/logged_in',/*loggedInAlready, */passwordless.acceptToken({
	//successRedirect: '/users/my',
	//enableOriginRedirect: true
}), function(req, res) {
	if (req.session.passwordless) {
		if (req.session.passwordless === req.session.uid) {	
			res.redirect('/users/my');
			
			return;
		}

		User.findById(req.session.passwordless).select('name email is_approved gravatar_hash').exec(function(err, user) {
			if (err) {
				logger.error(err, req.session, {line: 282});
				
				res.status(500).type('text')
					.send('Unexpected server error.');
				
				return
			}
			
			if (!user) {
				logger.error(err, req.session, {line: 291});
				
				res.status(500).type('text')
					.send('User not found.');
				
				return;
			}
			
			req.session.uid = user.id;
			req.session.name = user.name;
			req.session.email = user.email;
			req.session.gravatar_hash = user.gravatar_hash;

			if (!user.is_approved) {
				user.is_approved = true;
				
				user.save(function(err, user) {
					if (err) {
						logger.error(err, {line: 309});
					}
				});
				
				Subscribe.find({
					email: user.email
				}).select('user').exec(function(err, subscribes) {
					if (err) {
						logger.error(err, {line: 317});
						
						return;
					}
					
					subscribes.forEach(function(subscribe) {
						if (!subscribe.user) {
							subscribe.user = user._id;
							subscribe.save(function(err, subscribe) {
								if (err) {
									logger.error(err, {line: 327});
									
									return;
								}
							});
						}
					});
				});
			}

			res.redirect('/users/my');				
			
			return;
		});
	} else {
		res.type('text').send('The request token is invalid. It may have already been used, or expired because it is too old.');
	}
});

router.post('/update', mdlwares.restricted, function(req, res, next) {
	User.findById(req.session.uid).exec(function(err, user) {
		if (err) {
			logger.error(err, req.session, {line: 349});
			
			res.status(500).type('json')
				.json({error: 'Unexpected server error.'});
				
			return;
		}
		
		if (!user) {
			logger.error(err, req.session, {line: 358});
			
			res.status(400).type('json')
				.json({error: 'User not found.'});
				
			return;
		}
		
		user.about = req.body.about;
		
		user.save(function(err, user) {
			if (err) {
				logger.error(err, req.session, {line: 370});
				
				res.status(err.name === 'ValidationError' ? 400 : 500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}

			res.type('json')
				.json({user: user});
		});
	});
});

router.get('/login', mdlwares.renderIndexUnlessXhr);

router.get('/join', mdlwares.renderIndexUnlessXhr);

function getUser(req, res, next) {
	User.findById(req.params.id || req.session.uid)
		.select('created_at name gravatar_hash about stats')
		.exec(function(err, user) {
			if (err) {
				logger.error(err, req.session, {line: 393});
				
				res.status(500).type('json')
					.json({error: 'Unexpected server error.'});
					
				return;
			}
			
			res.type('json')
				.json({user: user});
		});	
}

router.get('/my', mdlwares.restricted, mdlwares.renderIndexUnlessXhr, getUser);

router.get('/:id', mdlwares.restricted, mdlwares.renderIndexUnlessXhr, getUser);

module.exports = router;