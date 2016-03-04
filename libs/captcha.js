var https = require('https');

var params = {
	key   : '6LcR3hkTAAAAAOYXPgZ4UsPhUo0P3ie6MRlTgbyp',
	secret: '6LcR3hkTAAAAAF_8EwMH0N3N4JqjeqnaxvCRuze6'
};

function verify(response, callback) {
console.log('https://www.google.com/recaptcha/api/siteverify?secret=' + params.secret + '&response=' + response)
    https.get('https://www.google.com/recaptcha/api/siteverify?secret=' + params.secret + '&response=' + response, function(res) {
        var data = '';
		
        res.on('data', function(chunk) {
            data += chunk.toString();
        });
		
        res.on('end', function() {
            try {
                var parsedData = JSON.parse(data);
console.log('parsedDataCaptcha = ', parsedData);
                callback(parsedData.success);
            } catch (e) {
                callback(false);
            }
        });
    });
}

module.exports.params = params;
module.exports.verify = verify;