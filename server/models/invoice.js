var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
function emailValidator(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
	
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
	amount: {
		type: Number,
		required: true
	},
	currency: {
		type: String,
		required: true
	},
	dest_id: {
		type: String,
		trim: true,
		validate: [emailValidator, 'Invalid email'],
		select: false,
		required: true
	},
	comment: {
		type: String,
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

var Invoice = mongoose.model('Invoice', schema);

module.exports = Invoice;