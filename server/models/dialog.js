var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var schema = mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	corr: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	lastMsg: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Private'
	},
	lastMsgCreatedAt: {
		type: Date,
		required: true
	},	
	created_at: { type: Date },
	updated_at: { type: Date }
});

schema.index({ user: 1, corr: 1 });
schema.index({ user: 1, lastMsgCreatedAt: -1 });
schema.index({ corr: 1, lastMsgCreatedAt: -1 });

schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

var Dialog = mongoose.model('Dialog', schema);

module.exports = Dialog;




// db.dialogs.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88')}, {corr: ObjectId('56afbbd26c1b918007ccdf88')}]}).sort({lastMsgCreatedAt: -1}).explain();

// db.dialogs.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}, {user: ObjectId('56afbf3fad0a5d4416d152b7'), corr: ObjectId('56afbbd26c1b918007ccdf88')}]}).explain();

// 'executionStats'

// db.dialogs.find({user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}).sort({lastMsgCreatedAt: -1}).explain();



// db.messages.find({order: ObjectId('56e499b1a85781e022612895'), _id: { $gt: ObjectId('5706e896beed901c13413985') }}).sort({_id: 1}).explain();

// db.messages.find({order: ObjectId('56e499b1a85781e022612895')}).sort({_id: 1}).explain();



// db.privates.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}, {user: ObjectId('56afbf3fad0a5d4416d152b7'),corr: ObjectId('56afbbd26c1b918007ccdf88')}], _id: { $gt: ObjectId('5706e896beed901c13413985') }}).sort({_id: 1}).explain();

// db.privates.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}, {user: ObjectId('56afbf3fad0a5d4416d152b7'),corr: ObjectId('56afbbd26c1b918007ccdf88')}]}).sort({_id: 1}).explain();











return;


/** 
	Create dialogs
**/

var Message = require('./message');

Message.find({
	order: null
}).exec(function(err, messages) {
	if (err) {
		console.dir(err);
			
		return
	}
	
	console.log('messages.length = ', messages.length)
	
	var index = 0;
	proc(messages[index]);
		
	function proc(message) {
		if (!message) {
			console.log('finish');
			
			return;
		}
		
		if (err) {
			console.dir(err);
				
			return
		}
		
		if (message.user.toString() === message.corr.toString()) {
			proc(messages[++index]);
			return;
		}
		
		Dialog.findOne({
			$or: [{
				user: message.user,
				corr: message.corr
			}, {
				user: message.corr,
				corr: message.user
			}]
		}).sort('-lastMsgCreatedAt').exec(function(err, dialog) {
			if (err) {
				console.dir(err);
					
				return
			}
		
			if (!dialog) {
				console.log('message.user = ', message.user);
				console.log('message.corr = ', message.corr);

				dialog = new Dialog({						
					user: message.user,
					corr: message.corr
				}); 
				
				Message.findOne({
					order: null,
					$or: [{
						user: message.user,
						corr: message.corr
					}, {
						user: message.corr,
						corr: message.user
					}]
				}).sort('-created_at').exec(function(err, message) {
					if (err) {
						console.dir(err);
							
						return;
					}
					
					if (!message) {
						console.log('!message');
						console.dir(dialog);
							
						return;
					}					
				
					dialog.lastMsg = message._id;
					dialog.lastMsgCreatedAt = message.created_at;
					
					dialog.save(function(err, dialog) {
						if (err) {
							console.dir(err);
								
							return;
						}
						
						console.log('new dialog!');
						
						proc(messages[++index]);
					});
				}); 
			} else {
				proc(messages[++index]);
			}
		});
	};
});