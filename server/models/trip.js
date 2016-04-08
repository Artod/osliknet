var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	orderSchema = require('./orderSchema');

var whenValidator = function(value) {
  // `this` is the mongoose document
  console.log('whenValidator', value)
  
	if (!this.isNew) {
		return true;
	}
	
	var now = (new Date()).getTime() - 1000*60*60*24;

	return now < value.getTime();
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

var schema = mongoose.Schema({
	user: {
		type: Schema.Types.ObjectId,
		required: true,		
		ref: 'User'
	},
    when: {
		type: Date,		
		required: true,
		validate: [whenValidator, 'Date dont must be less than today']/*,
		get: function(when) {
			return dateFormat(when);
		}*/
	},
	from: {
		type: String,
		trim: true,
		required: true
	},
	from_id: {
		type: String,
		trim: true,
		required: true
	},
	to: {
		type: String,
		trim: true,
		required: true
	},
	to_id: {
		type: String,
		trim: true,
		required: true
	},
	description: {
		type: String,
		default: '',
		trim: true,
		required: true,
		maxlength: 2000
	},
	is_removed: {
		type: Boolean,
		default: false
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

schema.index({user: 1});
schema.index({when: 1, _id: -1});
 
schema.method('dateFormat', dateFormat);

schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if (this.isNew) {
		this.created_at = now;
	}
	
	next();
});

var Trip = mongoose.model('Trip', schema);

module.exports = Trip;