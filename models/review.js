var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
var schema = mongoose.Schema({
	order: {
		type: Schema.Types.ObjectId,
		required: true,
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
	isUserTripper: {
		type: Boolean,
		required: true
	},
	rating: {
		type: Number,
		required: true,
		validate: [function(value) {
			return [1, 2, 3, 4, 5].indexOf(value) > -1;
		}, 'Rating can be 1, 2, 3, 4 or 5']
	},
	comment: {
		type: String,
		required: true,
		trim: true,
		maxlength: 2000
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

var Review = mongoose.model('Review', schema);

module.exports = Review;