var paypal = require('paypal-rest-sdk');
var config = {};

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

/*
 * SDK configuration
 */

exports.init = function(c){
  config = c;
  paypal.configure(c.api);
}