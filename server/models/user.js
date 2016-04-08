var mongoose = require('mongoose');
// var sendgrid_api_key = 'v ftp';
// var sendgrid  = require('sendgrid')(sendgrid_api_key);
var config = require('../config');
var sendgrid  = require('sendgrid')(config.sendgrid.key);

var winston = require('winston');
var path = require('path');
var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, '../logs/user.log')
		})
    ],
	exitOnError: false
});

function emailValidator(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var schema = mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		validate: [function(val) { return /^[a-z0-9-_ \.]+$/i.test(val) }, 'Invalid name'],
		unique: true,
		index: true
	},
    email: {
		type: String,		
		trim: true,
		required: true,
		validate: [emailValidator, 'Invalid email'],
		unique: true,
        index: true,
		select: false/*,
		set: function(v) { return v.toLowerCase(); }*/
	},
	gravatar_hash: {
		type: String,		
		required: true
	},
	about: {
		type: String,
		select: false,
		default: '',
		trim: true,
		maxlength: 2000
	},
	is_approved: {
		type: Boolean,
		select: false,
		default: false
	},
	stats: {
		t_cnt: { // on create trip
			type: Number,
			select: false,
			default: 0
		},
		t_order: { // on create trip
			type: Number,
			select: false,
			default: 0
		},
		t_proc: { // on set order status finish
			type: Number,
			select: false,
			default: 0
		},
		t_rate: { // on create or change review
			type: Array,
			select: false,
			default: [0, 0, 0, 0, 0]
		},		
		r_cnt: { // on create order (request)
			type: Number,
			select: false,
			default: 0
		},
		r_proc: { // on set order status finish
			type: Number,
			select: false,
			default: 0
		},
		r_rate: { // on create or change review
			type: Array,
			select: false,
			default: [0, 0, 0, 0, 0]
		}
	},
	newOrders: {
		type: Array,
		select: false,
		default: []
	},
	newTrips: {
		type: Array,
		select: false,
		default: []
	},
	newMessages: {
		type: {},
		select: false,
		default: {}
	},
	newPrivMessages: {
		type: {},
		select: false,
		default: {}
	},
	needEmailNotification: {
		type: Boolean,
		select: false,
		default: false
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});


schema.index({ needEmailNotification: 1, updated_at: 1});

schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

schema.statics.stats = function(uid, param, val, oldVal) {
	this.findById(uid).select('stats.' + param).exec(function(err, user) {
		if (err || !user) {
			logger.error(err, uid, param, val, oldVal, {line: 136});
			
			return;
		}

		/*if (param === 't_rate' || param === 'r_rate') {
			if (oldVal) {
				if (oldVal === val) {
					return;
				}
				
				user.stats[param][oldVal - 1]--;
			}

			user.stats[param][val - 1]++;			
		} else {
			user.stats[param] = user.stats[param] + val;			
		}*/

		user.stats[param] = val;		
		user.markModified('stats.' + param);
		user.save(function(err, user) {
			if (err) {
				logger.error(err, uid, param, val, oldVal, {line: 159});
			}
		});
	});
};

schema.statics.setUnreaded = function(field, uid, id) {
	this.findById(uid).select(field + ' needEmailNotification').exec(function(err, user) {
		if (err) {
			logger.error(err, field, uid, id, {line: 168});
			
			return;
		}
			
		user[field].push(id);
		user.needEmailNotification = true;
		
		user.save(function(err, user) {
			if (err) {
				logger.error(err, field, uid, id, {line: 172});
			}
		});
	});
};

schema.statics.setReaded = function(field, uid, id) {
	this.findById(uid).select(field + ' needEmailNotification').exec(function(err, user) {
		if (err) {
			logger.error(err, field, uid, id, {line: 181});
			
			return;
		}
		
		var indexOf = user[field].indexOf(id); // if length == 0 or undefined id then -1 
		
		if (indexOf === -1 && !user.needEmailNotification) {		
			return;
		}		
		
		if (id) {
			if (indexOf > -1) {
				user[field].splice(indexOf, 1);
			}
		} else {
			user[field] = [];
		}
		
		user.needEmailNotification = false;

		user.save(function(err, user) {
			if (err) {
				logger.error(err, field, uid, id, {line: 210});
			}
		});
	});
};

var changeCount = function(obj, setZero, lid) {
	var count = -1,
		lid = ( lid || ( obj && obj[1] ) || 0 );
	
	if (!setZero) {		
		count = ( ( obj && Number(obj[0]) ) || 0 );
	}
	
	return [++count, lid];
};

schema.statics.setMessagesUnreaded = function(uid, oid, lid) {
	this.findById(uid).select('newMessages needEmailNotification').exec(function(err, user) {	
		if (err) {
			logger.error(err, uid, oid, lid, {line: 230});
			
			return;
		}	
		
		user.newMessages[oid] = changeCount(user.newMessages[oid], false, lid);
		
		user.markModified('newMessages');

		user.needEmailNotification = true;
		
		user.save(function(err, user) {
			if (err) {
				logger.error(err, uid, oid, lid, {line: 243});
			}
		});
	});
};

schema.statics.setMessagesReaded = function(uid, oid) {
	this.findById(uid).select('newMessages newOrders needEmailNotification').exec(function(err, user) {
		if (err) {
			logger.error(err, uid, oid, {line: 252});
			
			return;
		}	

		var indexOf = user.newOrders.indexOf(oid); // if length == 0 or undefined oid then -1 

		if ( (!user.newMessages[oid] || !user.newMessages[oid][0]) && indexOf === -1 && !user.needEmailNotification ) {
			return;
		}	

		if (indexOf > -1) {
			user.newOrders.splice(indexOf, 1);
		}

		user.newMessages[oid] = changeCount(user.newMessages[oid], true);
		user.markModified('newMessages');
		
		user.needEmailNotification = false;

		user.save(function(err, user) {
			if (err) {
				logger.error(err, uid, oid, {line: 274});
			}
		});
	});
};

schema.statics.setPrivMessagesUnreaded = function(uid, cid, lid) {
	if (uid === cid) {
		return;
	}
	
	this.findById(uid).select('newPrivMessages needEmailNotification').exec(function(err, user) {
		if (err) {
			logger.error(err, uid, cid, lid, {line: 287});
			
			return;
		}
		
		// user.newPrivMessages[cid] = user.newPrivMessages[cid] || 0;
		// user.newPrivMessages[cid]++;
		
		user.newPrivMessages[cid] = changeCount(user.newPrivMessages[cid], false, lid);
		user.markModified('newPrivMessages');

		user.needEmailNotification = true;
		
		user.save(function(err, user) {
			if (err) {
				logger.error(err, uid, cid, lid, {line: 302});
			}
		});
	});
};

schema.statics.setPrivMessagesReaded = function(uid, cid) {
	this.findById(uid).select('newPrivMessages needEmailNotification').exec(function(err, user) {
		if (err) {
			logger.error(err, uid, cid, {line: 311});
			
			return;
		}

		if ( (!user.newPrivMessages[cid] || !user.newPrivMessages[cid][0]) && !user.needEmailNotification ) {			
			return;
		}
		
		user.newPrivMessages[cid] = changeCount(user.newPrivMessages[cid], true);
		user.markModified('newPrivMessages');
		
		user.needEmailNotification = false;

		user.save(function(err, user) {
			if (err) {
				logger.error(err, uid, cid, {line: 327});
			}
		});
	});
};

var User = mongoose.model('User', schema);

setInterval(function() {
	User.find({
		needEmailNotification: true,
		updated_at: { $lt: ( new Date() ).getTime() - config.emailNotifyInterval }
	}).select({
		name: 1,
		email: 1,
		newMessages: 1,
		newPrivMessages: 1,
		newOrders: 1,
		newTrips: 1,
		needEmailNotification: 1
	}).exec(function(err, users) {
		if (err) {
			logger.error(err, {line: 349});
			
			return;
		}
		
		users.forEach(function(user) {
			user.needEmailNotification = false;
			
			var newOrders = user.newOrders;
			var newTrips = user.newTrips;
			
			var msgsInOrder = Object.keys(user.newMessages).filter(function(oid) {
				if (!user.newMessages[oid][0]) {
					delete user.newMessages[oid]; // потому что чела уже давно небыло на сайте все равно
					
					return false;
				}
				
				return true;
			});

			var msgsInDialog = Object.keys(user.newPrivMessages).filter(function(cid) {
				if (!user.newPrivMessages[cid][0]) {
					delete user.newPrivMessages[cid];
					
					return false;
				}
				
				return true;
			});			
			
			user.markModified('newMessages');
			user.markModified('newPrivMessages');
			
			user.save(function(err, user) {
				if (err) {
					logger.error(err, {line: 385});
				}
			});
			
			if (newOrders.length || msgsInOrder.length) {
				var text = '<h1>Hello, ' + user.name + '!</h1><ul>';
				
				if (newOrders.length) {
					text += '<li>You have new ' + ( newOrders.length > 1 ? '<a href="' + config.host + 'orders">orders</a>' : '<a href="' + config.host + 'messages/order/' + newOrders[0] + '">order</a>') + '.</li>';
				}
				
				if (msgsInOrder.length) {
					text += '<li>You have new ' + (msgsInOrder.length > 1 ? '<a href="' + config.host + 'orders">messages</a>' : '<a href="' + config.host + 'messages/order/' + msgsInOrder[0] + '">message</a>') + '.</li>';
				}
				
				if (newTrips.length) {
					text += '<li>We have new <a href="' + config.host + 'trips">trip' + (newTrips.length > 1 ? 's' : '') + '</a> you are waiting for.</li>';
				}
				
				if (msgsInDialog.length) {
					text += '<li>You have new ' + (msgsInDialog.length > 1 ? '<a href="' + config.host + 'messages">private messages</a>' : '<a href="' + config.host + 'messages/user/' + msgsInDialog[0] + '">private message</a>') + '.</li>';
				}
				
				text += '</ul> <p>Team <a href="' + config.host + '">' + config.name + '</a> .</p>';
				
				var email = new sendgrid.Email();
				
				email.addTo(user.email);
				email.setFromName(config.name);
				
				email.subject = 'Notifications from ' + config.name;
				email.from = config.email;
				// email.text = text;
				email.html = text;
				
				sendgrid.send(email, function(err, json) {
					if (err) {
						logger.error(err, {line: 420});
					}
				});
			}
		});			
		
	});
// }, 1000*60*5);
}, config.emailNotifyInterval);

module.exports = User;

/*
User.find().exec(function(err, users) {	
	users.forEach(function(user) {
		user.gravatar_hash = crypto.createHash('md5').update(user.email).digest('hex');
		user.save();
	});
})

User.find().select('newPrivMessages').exec(function(err, users) {	
	users.forEach(function(user) {
		user.newPrivMessages = null;
		user.save();
	});
})*/

/*
User.find().select('stats.t_rate stats.r_rate').exec(function(err, user) {
	user.forEach(function(user){
		
		user.stats.t_rate = null
		user.stats.r_rate = null
		
		user.markModified('stats.t_rate');
		user.markModified('stats.r_rate');
		user.save();
		
	});
});
*/

/*User.find().exec(function(err, users) {
	users.forEach(function(user) {
		user.is_approved = false;
		user.save();
	});
	
})*/








