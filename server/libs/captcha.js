var https = require('https');
var config = require('../config');

function verify(response, callback) {
    https.get('https://www.google.com/recaptcha/api/siteverify?secret=' + config.recaptcha.secret + '&response=' + response, function(res) {
        var data = '';
		
        res.on('data', function(chunk) {
            data += chunk.toString();
        });
		
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
                callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
}

module.exports.params = config.recaptcha;
module.exports.verify = verify;