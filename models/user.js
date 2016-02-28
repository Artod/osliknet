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

var changeCount = function(obj, setZero, lid) {
	var count = -1,
		lid = ( lid || ( obj && obj[1] ) || 0 );
	
	if (!setZero) {		
		count = ( ( obj && Number(obj[0]) ) || 0 );
	}
	
	return [++count, lid];
};

schema.statics.setMessagesUnreaded = function(uid, oid, lid, cb) {
	this.findById(uid).select('newMessages needEmailNotification').exec(function(err, user) {	
		//user.newMessages[oid] = user.newMessages[oid] || 0;
		//user.newMessages[oid]++;		
		
		user.newMessages[oid] = changeCount(user.newMessages[oid], false, lid);
		
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
/*console.log('user.newMessages[oid]',user.newMessages[oid]);
console.log('user.newMessages[oid][0]',user.newMessages[oid][0]);
console.log('indexOf',indexOf);*/
		if ( (!user.newMessages[oid] || !user.newMessages[oid][0]) && indexOf === -1 && !user.needEmailNotification ) {
			cb && cb(err, user);
console.log('cancelcancelcancelcancelcancelcancelcancelcancelcancel');
			return;
		}	

		if (indexOf > -1) {
			user.newOrders.splice(indexOf, 1);
		}
		
	
		
		/*if (oid) {
			// delete user.newMessages[oid];
		} else {
			user.newMessages = {};
		}*/

		user.newMessages[oid] = changeCount(user.newMessages[oid], true);
		user.markModified('newMessages');
		
		user.needEmailNotification = false;

		user.save(function(err, user) {
			//log errors
			cb && cb(err, user);
		});
	});
};

schema.statics.setPrivMessagesUnreaded = function(uid, cid, lid, cb) {
	if (uid === cid) {
		cb && cb({error: 'Message to yourself'});
		return;
	}
	
	this.findById(uid).select('newPrivMessages needEmailNotification').exec(function(err, user) {
		if (err) {
			cb && cb(err, user);
			return;
		}
		
		// user.newPrivMessages[cid] = user.newPrivMessages[cid] || 0;
		// user.newPrivMessages[cid]++;
		
		user.newPrivMessages[cid] = changeCount(user.newPrivMessages[cid], false, lid);
		user.markModified('newPrivMessages');

		user.needEmailNotification = true;
		
		user.save(function(err, user) {
			//log errors
			cb && cb(err, user);
		});
	});
};

schema.statics.setPrivMessagesReaded = function(uid, cid, cb) {
	this.findById(uid).select('newPrivMessages needEmailNotification').exec(function(err, user) {
		if (err) {
			cb && cb(err, user);
			return;
		}

		if ( (!user.newPrivMessages[cid] || !user.newPrivMessages[cid][0]) && !user.needEmailNotification ) {
			cb && cb(err, user);
			
			return;
		}
		
		user.newPrivMessages[cid] = changeCount(user.newPrivMessages[cid], true);
		user.markModified('newPrivMessages');
		
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
		newPrivMessages: 1,
		newOrders: 1,
		needEmailNotification: 1
	}).exec(function(err, users) {
		users.forEach(function(user) {
			user.needEmailNotification = false;
			
			var newOrders = user.newOrders;
			
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
				//log errors
console.dir(user._doc)
			});
			
			if (newOrders.length || msgsInOrder.length) {
				var text = '<h1>Hello, ' + user.name + '!</h1>';
				
				if (newOrders.length) {
					text += '<p>You have new ' + ( newOrders.length > 1 ? '<a href="http://osliki.net/orders">orders</a>' : '<a href="http://osliki.net/messages/order/' + newOrders[0] + '">order</a>') + '.</p>'
				}
				
				if (msgsInOrder.length) {
					text += '<p>You have new ' + (msgsInOrder.length > 1 ? '<a href="http://osliki.net/orders">messages</a>' : '<a href="http://osliki.net/messages/order/' + msgsInOrder[0] + '">message</a>') + '.</p>'
				}			
				
				if (msgsInDialog.length) {
					text += '<p>You have new ' + (msgsInDialog.length > 1 ? '<a href="http://osliki.net/messages">private messages</a>' : '<a href="http://osliki.net/messages/user/' + msgsInDialog[0] + '">private message</a>') + '.</p>'
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
}, 1000*2);

module.exports = User;

/*
User.find().select('newPrivMessages').exec(function(err, user) {
	user.forEach(function(user){
		
		user.newPrivMessages = {};
		
		user.markModified('newPrivMessages');
		user.save();
		
	});
});*/










