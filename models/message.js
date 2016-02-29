var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var messageSchema = mongoose.Schema({
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


var Message = mongoose.model('Message', messageSchema);

module.exports = Message;