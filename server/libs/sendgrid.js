var config = require('../config');
var sendgrid  = require('sendgrid')(config.sendgrid.key);


module.exports = sendgrid;