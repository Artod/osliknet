/*

TODO:

\/- Statuses
\/- Check comments
\/- Notification
\/- router.post('/add'
	\/- send email to traveler
	\/- inc order counter
	
\/- Profile
\/- Reviews + 
\/-rating

\/- Modal css
\/- hide request delivery button if there is order already
\/- textarea везде maxlength: 2000

\/- TripPage + edit
\/- messages counter

\/- Paging

\/- pre('save' created_at переделать

\- Subscribe on new trips
\/- капча
	\/субскрайб по емайл
	\/перенос субскрайбов при авторизации
	\/нотификации
	
\/- login + sign in page + капча
\/- text pipe to br 
\/- logged in already убрать 

\/- unauth middleware
\/- beforeRouterFilter !req.xhr ? res.render('index')

\/+ validation add trip form
+ msg about new review to link
?- not found error on query


\/- angular beforeRouterFilter
\/- ссылка на join в логине
\/- request for delivery for unauth users

\/- Logging errors
\/- prerender index
\/- Calendar css


\/- Index page



\/- assembling gulp


- hosting 
- deploy (secret key captcha + sendgrid)




- ssl https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04
- paypal

- soc share


- tests











- iptables





*/

    /*"angular2": "2.0.0-beta.0", */
    /*"es6-promise": "^3.0.2",
    "es6-shim": "^0.33.3",*/	    /*"reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.0",*/    /*"systemjs": "0.19.6",
    "zone.js": "0.5.10"*/



var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var winston = require('winston');
 
winston.handleExceptions(new winston.transports.File({
	filename: 'logs/exceptions.log',
	handleExceptions: true,
	humanReadableUnhandledException: true,
	exitOnError: false
}));
  
var cookieParser = require('cookie-parser');

var session = require('express-session');
var MongoStoreSession = require('connect-mongo')(session);

var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var trips = require('./routes/trips');
var orders = require('./routes/orders');
var messages = require('./routes/messages');
var reviews = require('./routes/reviews');
var subscribes = require('./routes/subscribes');

var config = require('./config');



var app = express();

var mongoose = require('mongoose');
// TODO: MongoDB setup (given default can be used)
// var pathToMongoDb = 'mongodb://localhost/osliknet';

mongoose.connect(config.mongo.path);
//We have a pending connection to the test database running on localhost. We now need to get notified if we connect successfully or if a connection error occurs:

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  // yay!
});

// app.set('env', 'production')
app.set('env', 'development')






var passwordless = require('passwordless');


var MongoStorePasswordless = require('passwordless-mongostore-bcrypt-node');


// var sendgrid_api_key = 'v ftp'config.sendgrid.key;
// var sendgrid  = require('sendgrid')(config.sendgrid.key);
// var sendgrid  = require('sendgrid')('hjhh');


// var yourEmail = config.email;
/*
// TODO: email setup (has to be changed)

var email   = require("emailjs");
var yourEmail = 'osliknet@gmail.com';
var yourPwd = 'v ftp';
var yourSmtp = 'smtp.gmail.com';
var smtpServer = email.server.connect({
   user: yourEmail, 
   password: yourPwd, 
   host: yourSmtp, 
   ssl: true
});


*/












// TODO: Path to be send via email
// var host = 'http://localhost:3000/'config.host;

// Setup of Passwordless
/*
var mongoStorePasswordlessInst = new MongoStorePasswordless(pathToMongoDb, {
    mongostore: {
        collection: 'token'
	}
});

mongoStorePasswordlessInst._db = db;
*/

//TODO: Поправить сделать чтоб один коннект был монгусовский щас нельзя моотому что другой обьект использует


// app.set('passwordlessTTL', config.passwordless.ttl);
 
passwordless.init(new MongoStorePasswordless(config.mongo.path, {
    mongostore: {
        collection: config.passwordless.collection
	}
}), {
	userProperty: config.passwordless.userProperty
});

passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback, req) {
	req.passwordless = req.passwordless || {};
	req.passwordless.tokenToSend = tokenToSend;
	req.passwordless.uidToSend = uidToSend;
	req.passwordless.recipient = recipient;
console.dir(req.passwordless)
	callback();
}, {
	ttl: config.passwordless.ttl //app.get('passwordlessTTL')	
});








app.locals.title = 'OSLiKi.Net';
//app.locals.strftime = require('strftime');
app.locals.email = config.email;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
if (app.get('env') === 'development') {
	app.use( morgan('dev') );
}
app.use(bodyParser.json());
/* !!!!!extended */app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


/*** Session */
var sessionParam = {
	secret: config.session.secret,
	cookie: {
		maxAge: config.cookie.maxAge
	},
	store: new MongoStoreSession({
		mongooseConnection: db,
		touchAfter: config.session.touchAfter //24 * 3600 // time period in seconds. To be updated only one time in a period of 24 hours	
	}),
	saveUninitialized: false,
	resave: false
}

if (app.get('env') === 'production') {
	// app.set('trust proxy', 1) // trust first proxy
	// sessionParam.cookie.secure = true // serve secure cookies
}

app.use( session(sessionParam) );
/* Session ***/


app.use( express.static( path.join(__dirname, '../public') ) );

// app.use(express.static(path.join(__dirname, 'node_modules')));
// app.use(express.static(path.join(__dirname, 'scripts')));
// app.use('/node_modules/ng2-datepicker', express.static(__dirname + '/node_modules/ng2-datepicker'));
// app.use('/modules/moment', express.static(__dirname + '/node_modules/moment'));

// app.use('/modules/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
// app.use('/modules/angular2',  express.static(path.join(__dirname, '../node_modules/angular2/bundles')));
// app.use('/modules/systemjs',  express.static(path.join(__dirname, '../node_modules/systemjs/dist')));
// app.use('/modules/rxjs',      express.static(path.join(__dirname, '../node_modules/rxjs/bundles')));
// app.use('/client_dist',       express.static(path.join(__dirname, '../client_dist')));
// app.use('/scripts', express.static(path.join(__dirname, '/scripts')));

// Passwordless middleware
app.use(passwordless.sessionSupport());
// app.use(passwordless.acceptToken({ successRedirect: '/successRedirect', failureRedirect: '/errorredir' }));
 
/*app.set('orderStatus', {
	5: 'Negotiation',
	10: 'Processing',
	15: 'Refused',
	20: 'Cancelled',
	25: 'Finished'
});*/

// app.set('orderStatusConst', require('./models/order').sts);

var Order = require('./models/order');

app.use(function (req, res, next) {
	res.locals = {
		user: {
			id: req.session.uid,
			name: req.session.name,
			gravatar_hash: req.session.gravatar_hash
		},
		orderStatus: JSON.stringify(Order.stsInv),
		orderStatusConst: JSON.stringify(Order.sts),
		recaptcha: config.recaptcha
	};

	next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/trips', trips);
app.use('/orders', orders);
app.use('/messages', messages);
app.use('/reviews', reviews);
app.use('/subscribes', subscribes);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;




/*

Angular2, Node.js, MongoDB, TypeScript, JavaScript, ES6, Express.js, HTML5, Bootstrap, Jade, jQuery, delivery, p2p, startup, ecmascript 6, MEAN, mongoose


Creating project http://osliki.net on Node.js:

http://osliki.net

People who travel frequently can deliver any thing. For example you live in the US you urgently need any medication from Russia or documents. In our application you can find someone who is just about to arrive from Moscow to New York. He can help you for money or for free.

Benefits:
- Speed ​​of delivery, low cost of goods in the country of the manufacturer,
- The transportation of prohibited goods for delivery by mail (medication, food, documents)
- Low shipping costs in some cases (for example a bicycle from Boston to Montreal).

Disadvantages:
- Low responsibility of participants (need ratings, connection profiles of social networks)
- Fears and concerns of travelers (the opportunity to earn)
- Low cost of transport compared with the price of the flight by plane


Donate WebMoney http://www.donationalerts.ru/r/artglem (reading a message by google-man)
Donate PayPal https://www.twitchalerts.com/donate/artglem (reading a message by google-woman)


GitHub:

https://github.com/artod/osliknet

Restream:

- https://www.livecoding.tv/artglem/
- http://www.twitch.tv/artglem
- http://www.hitbox.tv/Artglem


Люди которые часто путешествуют могут доставлять какие-либо  вещи. Например ты живешь в США тебе срочно нужны какие-либо лекарства из России или документы. В нашем приложении  ты можешь найти человека который как раз собирается приехать из Москвы в Нью-Йорк. Он может помочь тебе за деньги или бесплатно.

Недостатки: 
- низкая ответсвенность участников (нужны рейтинги, подключение профилей социальных сетей)
- страхи и опасения путешественников (возможность заработать)
- дешевизна перевозки по сравнению с ценой перелета на самолете

Преимущества:
- скорость доставки, дешевизна товаров в стране производителя,
- перевоз запрещенных товаров для доставки по почте (лекарства, еда, документы),
- низкая стоимость доставки в некоторых случаях (например велосипед из Бостона в Монреаль).




People who travel frequently can deliver any thing. For example you live in the US you urgently need any medication from Russia or documents. In our application you can find someone who is just about to arrive from Moscow to New York. He can help you for money or for free.

Disadvantages:
- Low responsibility of participants (need ratings, connection profiles of social networks)
- Fears and concerns of travelers
- Low cost of transport compared with the price of the flight by plane

Benefits:
- Speed ​​of delivery, low cost of goods in the country of the manufacturer,
- The transportation of prohibited goods for delivery by mail (medication, food, documents)
- Low shipping costs in some cases (for example a bicycle from Boston to Montreal).
*/





/*

orders
	messages
	
trips (soc net comments)

users
	reviews
		|trip_id
		|message


*/

