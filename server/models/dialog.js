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

schema.index({ user: 1, corr: 1 }, {unique: true});
schema.index({ user: 1, lastMsgCreatedAt: -1 });

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




// db.dialogs.find({user: ObjectId('56afbbd26c1b918007ccdf88')}).sort({lastMsgCreatedAt: -1}).explain();

// db.dialogs.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}, {user: ObjectId('56afbf3fad0a5d4416d152b7'), corr: ObjectId('56afbbd26c1b918007ccdf88')}]}).explain();

// 'executionStats'

// db.dialogs.find({user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}).sort({lastMsgCreatedAt: -1}).explain();



// db.messages.find({order: ObjectId('56e499b1a85781e022612895'), _id: { $gt: ObjectId('5706e896beed901c13413985') }}).sort({_id: 1}).explain();

// db.messages.find({order: ObjectId('56e499b1a85781e022612895')}).sort({_id: 1}).explain();



// db.privates.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}, {user: ObjectId('56afbf3fad0a5d4416d152b7'),corr: ObjectId('56afbbd26c1b918007ccdf88')}], _id: { $gt: ObjectId('5706e896beed901c13413985') }}).sort({_id: 1}).explain();

// db.privates.find({$or: [{user: ObjectId('56afbbd26c1b918007ccdf88'), corr: ObjectId('56afbf3fad0a5d4416d152b7')}, {user: ObjectId('56afbf3fad0a5d4416d152b7'),corr: ObjectId('56afbbd26c1b918007ccdf88')}]}).sort({_id: 1}).explain();




//db.trips.find({ from_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU', to_id: 'ChIJybDUc_xKtUYRTM9XV8zWRD0', when: { $gt: ((new Date()).getTime() - 1000*60*60*24) } }).sort({_id: -1}).explain();

//db.trips.find({ from_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU', when: { $gt: ((new Date()).getTime() - 1000*60*60*24) } }).sort({_id: -1}).explain('executionStats');


//db.subscribes.find({ from_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU', to_id: 'ChIJybDUc_xKtUYRTM9XV8zWRD0', email: 'mcattendlg@gmail.com' }).explain('executionStats');


//db.subscribes.find({ from_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU', to_id: 'ChIJybDUc_xKtUYRTM9XV8zWRD0', is_unsubed: false, user: ObjectId('56afbbd26c1b918007ccdf88') }).explain();




//db.reviews.runCommand("aggregate", {pipeline: [{$match: {isUserTripper: true,corr: ObjectId('56afbbd26c1b918007ccdf88')}}, {$group: {_id: "$rating",count: { $sum : 1 }}}], explain: true})

//db.reviews.find({ order: ObjectId('56e499b1a85781e022612895'), user: ObjectId('56afbbd26c1b918007ccdf88') }).explain();



//db.orders.find({ trip: {$in: [ObjectId('56d42a6ab2be09ac1c32f372'), ObjectId('56d7c2dbf69ae248127ed5c4')]} }).sort({status: 1, _id: -1}).explain('executionStats');

//db.orders.find({ trip: ObjectId('56d42a6ab2be09ac1c32f372'), user: ObjectId('56afbf3fad0a5d4416d152b7') }).explain('executionStats');


//user + status
	//db.orders.find({$or: [{user: ObjectId('56afbf3fad0a5d4416d152b7')}, {tripUser: ObjectId('56afbf3fad0a5d4416d152b7')}]}).sort({status: 1, _id: -1}).explain('executionStats');

	//db.orders.find({ user: ObjectId('56afbf3fad0a5d4416d152b7')}).explain('executionStats');
	//db.orders.find({ tripUser: ObjectId('56afbf3fad0a5d4416d152b7')}).explain('executionStats');


	//db.orders.find({ user: ObjectId('56afbf3fad0a5d4416d152b7'), status: 25}).explain('executionStats');
	//db.orders.find({ tripUser: ObjectId('56afbf3fad0a5d4416d152b7'), status: 25}).explain('executionStats');


	
	
//db.users.find({needEmailNotification: true,updated_at: { $lt: ( new Date() ).getTime() - 1000*60*10 }}).explain('executionStats');
	
	

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
		
		Dialog.find({
			$or: [{
				user: message.user,
				corr: message.corr
			}, {
				user: message.corr,
				corr: message.user
			}]
		}).sort('-lastMsgCreatedAt').exec(function(err, dialogs) {
			if (err) {
				console.dir(err);
					
				return
			}
		
			if (dialogs.length !== 2) {
				console.log('message.user = ', message.user);
				console.log('message.corr = ', message.corr);

				Message.findOne({
					order: null,
					$or: [{
						user: message.user,
						corr: message.corr
					}, {
						user: message.corr,
						corr: message.user
					}]
				}).sort('-_id').exec(function(err, message) {
					if (err) {
						console.dir(err);
							
						return;
					}
					
					if (!message) {
						console.log('!message');
							
						return;
					}
					
					var savedCount = 0;

					var createDialog = function(data) {
						var dialog = new Dialog(data);	

						dialog.lastMsg = message._id;
						dialog.lastMsgCreatedAt = message.created_at;
						
						dialog.save(function(err, dialog) {
							if (err) {
								console.dir(err);
									
								return;
							}
							
							savedCount++;
							
							if (savedCount === 2) {
								console.log('new couple of dialog!');
								
								proc(messages[++index]);								
							}
						});					
					};
				
					createDialog({
						user: message.user,
						corr: message.corr
					});
					
					createDialog({
						user: message.corr,
						corr: message.user
					});
				}); 
			} else {
				proc(messages[++index]);
			}
		});
	};
});