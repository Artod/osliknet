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
	message: {
		type: String,
		required: true,
		trim: true
	},
	status: {
		type: Number,
		default: 5
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

schema.statics.sts = {
	NEGOTIATION: 5,
	PROCESSING: 10,			
	REFUSED: 15,
	CANCELLED: 20,			
	FINISHED: 25
};

var Order = mongoose.model('Order', schema);

/* Order.find(function(err, orders){
	orders.forEach(function(order){
		order.status = 5;
		order.save();
	});
}) */


module.exports = Order;


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