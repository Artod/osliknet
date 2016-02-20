var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var orderSchema = mongoose.Schema({
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
		default: 0 // 0 - pending waiting for traveler, 1 - wating for customer, 2.5 - processing, 2 - canceled, 3 - refused
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

orderSchema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

var Order = mongoose.model('Order', orderSchema);

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