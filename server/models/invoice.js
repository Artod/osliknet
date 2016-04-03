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
	status: {
		type: Number,
		required: true,
		default: 5
	},
	fees: {
		type: Schema.Types.Mixed
	},
	payment: {
		type: Schema.Types.Mixed,
		select: false
	},
	comment: {
		type: String,
		trim: true,
		maxlength: 2000
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

schema.statics.sts = {
	UNPAID: 5,
	PAID: 10,	
	TRANSFERRED: 15,
	REFUNDED: 20,
	PENDING: 25,
	UNCLEARED: 30
};

schema.statics.stsInv = {
	5: 'Unpaid',
	10: 'Paid and hold',
	15: 'Transferred to the tripper',
	20: 'Refunded',
	25: 'Pending',
	30: 'Uncleared'
};

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