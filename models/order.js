var mongoose = require('mongoose'),
	orderSchema = require('./orderSchema');



var Order = mongoose.model('Order', orderSchema);

module.exports = Order;