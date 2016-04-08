var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var schema = mongoose.Schema({
	trip: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Trip'
	},
	user: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
	},
	tripUser: {
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
	status: {
		type: Number,
		required: true,
		default: 5
	},
	msg_cnt: {
		type: Number,
		default: 0
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

schema.index({ trip: 1, user: 1 }, {unique: true}); // duplicates on localhost
schema.index({ user: 1, status: 1 });
schema.index({ tripUser: 1, status: 1 });
 
schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

schema.statics.sts = {
	NEGOTIATION: 5,
	PROCESSING: 10,			
	REFUSED: 15,
	CANCELLED: 20,			
	FINISHED: 25
};

schema.statics.stsInv = {
	5: 'Negotiation',
	10: 'Processing',
	15: 'Refused',
	20: 'Cancelled',
	25: 'Finished'
};

var Order = mongoose.model('Order', schema);

/* Order.find(function(err, orders){
	orders.forEach(function(order){
		order.status = 5;
		order.save();
	});
}) */


module.exports = Order;
/*
Order.find().populate('trip').exec(function(err, order){
	order.forEach(function(order) {
		order.tripUser = mongoose.Types.ObjectId(order.trip.user);
		order.save();
	});
});*/
	/*messages: [
		{
			uid: {
				type: String,
				// !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!required: true
			},
			message: {
				type: String,
				default: '',
				trim: true
			},
			created_at: {
				type: Date,
				default: Date.now
			}
		}
	],*/