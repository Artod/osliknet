var mongoose = require('mongoose');
var sendgrid_api_key = 'v ftp';
var sendgrid  = require('sendgrid')(sendgrid_api_key);

function emailValidator(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var schema = mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},
    email: {
		type: String,		
		required: true,
		validate: [emailValidator, 'Invalid email'],
		unique: true,
		select: false/*,
		set: function(v) { return v.toLowerCase(); }*/
	},
	gravatar_hash: {
		type: String,		
		required: true
	},
	about: {
		type: String,
		default: '',
		trim: true
	},
	is_approved: {
		type: Boolean,
		default: false
	},
	
	newOrders: {
		type: Array,
		default: []
	},
	newMessages: {
		type: {},
		default: {}
	},
	needEmailNotification: {
		type: Boolean,		
		default: false
	},
	
	created_at: { type: Date },
	updated_at: { type: Date }
});

schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

schema.statics.setOrderUnreaded = function(uid, oid, cb) {
	this.findById(uid).select('newOrders needEmailNotification').exec(function(err, user) {
		user.newOrders.push(oid);
		user.needEmailNotification = true;
		
		user.save(function(err, user) {
			//log errors
			cb && cb(err, user);
		});
	});
};

schema.statics.setOrderReaded = function(uid, oid, cb) {
	this.findById(uid).select('newOrders needEmailNotification').exec(function(err, user) {
		if (err) {
			cb && cb(err, user);
			return;
		}
		
		var indexOf = user.newOrders.indexOf(oid); // if length == 0 or undefined oid then -1 
		
		if (indexOf === -1 && !user.needEmailNotification) {
			cb && cb(err, user);
			
			return;
		}		
		
		if (oid) {
			if (indexOf > -1) {
				user.newOrders.splice(indexOf, 1);
			}
		} else {
			user.newOrders = [];
		}
		
		user.needEmailNotification = false;

		user.save(function(err, user) {
			//log errors
			cb && cb(err, user);
		});
	});
};

schema.statics.setMessagesUnreaded = function(uid, oid, cb) {
	this.findById(uid).select('newMessages needEmailNotification').exec(function(err, user) {	
		user.newMessages[oid] = user.newMessages[oid] || 0;
		user.newMessages[oid]++;		
		user.markModified('newMessages');

		user.needEmailNotification = true;
		
		user.save(function(err, user) {
			//log errors
			cb && cb(err, user);
		});
	});
};

schema.statics.setMessagesReaded = function(uid, oid, cb) {
	this.findById(uid).select('newMessages newOrders needEmailNotification').exec(function(err, user) {
		if (err) {
			cb && cb(err, user);
			return;
		}

		var indexOf = user.newOrders.indexOf(oid); // if length == 0 or undefined oid then -1 

		if (!user.newMessages[oid] && indexOf === -1 && !user.needEmailNotification) {
			cb && cb(err, user);
			
			return;
		}		
	
		if (oid) {
			if (indexOf > -1) {
				user.newOrders.splice(indexOf, 1);
			}
		} else {
			user.newOrders = [];
		}
		
		if (oid) {
			delete user.newMessages[oid];
		} else {
			user.newMessages = {};
		}

		user.markModified('newMessages');
		
		user.needEmailNotification = false;

		user.save(function(err, user) {
			//log errors
			cb && cb(err, user);
		});
	});
};

var User = mongoose.model('User', schema);

setInterval(function() {
	User.find({
		needEmailNotification: true,
		updated_at: { $lt: ( new Date() ).getTime() - 1000*/*60**/5 }
	}).select({
		name: 1,
		email: 1,
		newMessages: 1,
		newOrders: 1,
		needEmailNotification: 1
	}).exec(function(err, users) {
		users.forEach(function(user) {
			user.needEmailNotification = false;
			user.save(function(err, user) {
				//log errors
			});
			
			var newOrders = user.newOrders,
				newMessages = Object.keys(user.newMessages);
			
			if (newOrders.length || newMessages.length) {
				var text = '<h1>Hello, ' + user.name + '!</h1>';
				
				if (newOrders.length) {
					text += '<p>You have new ' + ( newOrders.length > 1 ? '<a href="http://osliki.net/requests">orders</a>' : '<a href="http://osliki.net//messages/request/' + newOrders[0] + '">order</a>') + '.</p>'
				}
				
				if (newMessages.length) {
					text += '<p>You have new ' + (newMessages.length > 1 ? '<a href="http://osliki.net/requests">messages</a>' : '<a href="http://osliki.net//messages/request/' + newMessages[0] + '">message</a>') + '.</p>'
				}
				
				console.log(text);
				
				var email = new sendgrid.Email();
				
				email.addTo(user.email);
				email.subject = 'Notifications from Osliki.Net';
				email.from = 'osliknet@gmail.com';
				email.text = text;
				email.html = text;
				
				sendgrid.send(email, function(err, json) {
					if (err) {
						console.log(err);
					}
					
					console.dir(json);
				});
			}
		});			
		
	});
// }, 1000*60*5);
}, 1000*10);

module.exports = User;










