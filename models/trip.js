var mongoose = require('mongoose');

var whenValidator = function(value) {
  // `this` is the mongoose document
  console.dir(this)
  
	if (!this.isNew) {
		return true;
	}
	
	var now = (new Date()).getTime() - 1000*60*60*24

	return now < value;
};

var dateFormat = function(when, needTime) {	
	if (!when) {
		return '';
	}
	
	var addZero = function(val) {
		return val.toString().replace(/^([0-9])$/, '0$1');
	}
	
	//var when = new Date(when)

	return (needTime ? addZero( when.getHours() ) + ':' + addZero( when.getMinutes() ) + ' ' : '') + addZero( when.getDate() ) + '-' +
		addZero(when.getMonth() + 1) + '-' +
		when.getFullYear();
};

var tripSchema = mongoose.Schema({
    when: {
		type: Date,		
		required: true,
		validate: [whenValidator, 'Date dont must be less than today'],
		get: function(when) {
			return dateFormat(when);
		}
	},
	from: {
		type: String,
		required: true
	},
	from_id: {
		type: String,
		required: true
	},
	to: {
		type: String,
		required: true
	},
	to_id: {
		type: String,
		required: true
	},
	description: {
		type: String,
		default: '',
		trim: true
	},
	is_removed: {
		type: Boolean,
		default: false
	},
	comments: [{
		uid: {
			type: String,
			required: true
		},
		pid: {
			type: String,
			required: true
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
	}],
	created_at: { type: Date },
	updated_at: { type: Date }
});

tripSchema.method('dateFormat', dateFormat);

tripSchema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if ( !this.created_at ) {
		this.created_at = now;
	}
	
	next();
});

var Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;