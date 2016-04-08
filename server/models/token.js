var mongoose = require('mongoose');

var tokenSchema = mongoose.Schema({
	uid: {
		type: String,
		index: true
	},
	ttl: Date
}, {collection: 'token'} );

tokenSchema.pre('save', function(next) {
	throw new Error('Read only for token collection');
});

var Token = mongoose.model('Token', tokenSchema);

module.exports = Token;