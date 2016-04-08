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
	message: {
		type: String,
		required: true,
		trim: true,
		maxlength: 1000
	},
	created_at: {
		type: Date,
		default: Date.now
	}
}); 

schema.index({ user: 1, corr: 1, _id: 1});

var Private = mongoose.model('Private', schema);

module.exports = Private;






return;

/** 
	Relocate privmsgs
**/


var Message = require('./message');

Message.find({
	order: null
}).sort('_id').exec(function(err, messages) {
	if (err) {
		console.log('1');
		console.dir(err);
			
		return;
	}
	
	console.log('messages.length = ', messages.length)
	
	var index = 0;

	
	
	proc(messages[index]);
		
	function proc(message) {
		if (!message) {
			console.log('2');
			console.log('finish');
			
			return;
		}
		
		if (err) {
			console.log('3');
			console.dir(err);
				
			return
		}
		
		if (message.user.toString() === message.corr.toString()) {
			proc(messages[++index]);
			return;
		}

		var privMsg = new Private({
			_id: message._id,
			user: message.user,
			corr: message.corr,
			message: message.message,
			created_at: message.created_at
		});
		
		privMsg.save(function(err, privMsg) {
			if (err) {
				console.log('4');
				console.dir(err);
					
				return;
			}
			
			console.log('new privMsg!');
			
			proc(messages[++index]);
		});
	}
	
	
	
});