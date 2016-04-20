var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
	
function emailValidator(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
	
var schema = mongoose.Schema({
	from: {
		type: String,
		trim: true
	},
	from_id: {
		type: String,
		trim: true
	},
	to: {
		type: String,
		trim: true
	},
	to_id: {
		type: String,
		trim: true
	},
	is_unsubed: {
		type: Boolean,
		default: false
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	email: {
		type: String,
		validate: [emailValidator, 'Invalid email'],
		trim: true,
		select: false,
		required: true
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

schema.index({user: 1});
schema.index({email: 1});

schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

var Subscribe = mongoose.model('Subscribe', schema);

module.exports = Subscribe;