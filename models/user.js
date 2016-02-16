var mongoose = require('mongoose');

function emailValidator(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}

var userSchema = mongoose.Schema({
	name: {
		type: String,
		trim: true,
		required: true,
		unique: true
	},
    email: {
		type: String,		
		required: true,
		validate: [emailValidator, 'Invalid email'],
		unique: true/*,
		set: function(v) { return v.toLowerCase(); }*/
	},
	gravatar_hash: {
		type: String,		
		required: true
	},
	about: {
		type: String,
		default: '',
		trim: true
	},
	is_approved: {
		type: Boolean,
		default: false
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

userSchema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if ( !this.created_at ) {
		this.created_at = now;
	}
	
	next();
});

var User = mongoose.model('User', userSchema);

module.exports = User;