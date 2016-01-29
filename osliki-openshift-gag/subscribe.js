/*
{
    "error": {
        "message": "Email validation failed",
        "name": "ValidationError",
        "errors": {
            "referer": {
                "properties": {
                    "type": "required",
                    "message": "Path `{PATH}` is required.",
                    "path": "referer"
                },
                "message": "Path `referer` is required.",
                "name": "ValidatorError",
                "kind": "required",
                "path": "referer"
            },
            "email": {
                "properties": {
                    "type": "user defined",
                    "message": "This email address is already registered",
                    "path": "email",
                    "value": "mcattendlg@gmail.com"
                },
                "message": "This email address is already registered",
                "name": "ValidatorError",
                "kind": "user defined",
                "path": "email",
                "value": "mcattendlg@gmail.com"
            }
        }
    }
}



{
    "error": {
        "code": 16544,
        "index": 0,
        "errmsg": "not authorized for insert on net.emails",
        "op": {
            "created_at": "2016-01-29T01:15:45.164Z",
            "updated_at": "2016-01-29T01:15:45.164Z",
            "email": "mcattendlg@gmail.com",
            "_id": "56aabd41a4c15ef7124b2ad5",
            "__v": 0
        }
    }
}



*/



var mongoose = require('mongoose');


var emailValidator = function(email) {
	var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	
	return re.test(email);
};

var schema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		validate: [emailValidator, 'Email doesn\'t valid']
	},
	ip: {
		type: String
	},
	created_at: { type: Date },
	updated_at: { type: Date }
});

// emailSchema.method('dateFormat', dateFormat);
//req.headers['referer']
schema.pre('save', function(next) {
	var now = new Date();
	
	this.updated_at = now;
	
	if ( !this.created_at ) {
		this.created_at = now;
	}
	
	next();
});

var Subscribe = mongoose.model('Subscribe', schema);

Subscribe.schema.path('email').validate(function (value, respond) {  
    Subscribe.findOne({ email: value }, function (err, subscribe) {
        if(subscribe) {
			respond(false);      
		} else {
			respond(true);			
		}
    });
	
}, 'This email address is already registered');

module.exports = Subscribe;