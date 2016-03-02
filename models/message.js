var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var User = require('./user');
	
var schema = mongoose.Schema({
	order: {
		type: Schema.Types.ObjectId,
		ref: 'Order'
	},
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
		maxlength: 2000
	},
	created_at: {
		type: Date,
		default: Date.now
	}
});

/*orderSchema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if ( !this.created_at ) {
		this.created_at = now;
	}
	
	next();
});*/

schema.statics.addToOrder = function(order, data, cb) {
	var message = new Message(data
	// {
		// order: order._id,
		// user: req.session.uid,
		// corr: corr,
		// message: req.body.message
	// }
	);		
	
	message.save(function(err, message) {
		if (err) {
			cb(err, message);
				
			return;
		}

		User.setMessagesUnreaded(message.corr, order.id, message.id);
		
		Message.find({
			order: message.order
		}).count().exec(function(err, count) {
			if (err) {
				//log
				
				return;
			}
			
			order.msg_cnt = count;

			order.save(function(err, order) {
				if (err) {
					//log
				}						
			});
		});
		
		cb(err, message);
	});
};

var Message = mongoose.model('Message', schema);

module.exports = Message;