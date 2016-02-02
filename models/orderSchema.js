var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var orderSchema = mongoose.Schema({
	trip_id: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'Trip'
	},
	uid: {
		type: Schema.Types.ObjectId,
		required: true,
		ref: 'User'
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
		default: 0 // 0 - waiting for traveler, 1 - wating for customer, 2 - canceled, 3 - refused
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

module.exports = orderSchema;