var mongoose = require('mongoose');

var orderSchema = mongoose.Schema({
	trip_id: {
		type: String,
		trim: true,
		required: true
	},
	uid: {
		type: String,
		// !!!!!!!!!!!!!!!!!!!!!!!!!!!required: true
	},
	messages: [
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
	],
	status: {
		type: Number,
		default: 0 // 0 - wating for traveler, 1 - wating for customer, 2 - canceled, 3 - refused
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

orderSchema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if ( !this.created_at ) {
		this.created_at = now;
	}
	
	next();
});

var Order = mongoose.model('Order', orderSchema);

module.exports = Order;