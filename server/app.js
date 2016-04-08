process.on('uncaughtException', function (error) {
   console.error('------------uncaughtException------------');
   console.dir(error.stack);
   console.error('------------uncaughtException------------');
});''


/*

jechanceux-buyer@gmail.com
jechanceux-facilitator@gmail.com

sudo service nginx restart && sudo pm2 restart www
sudo service nginx restart && sudo pm2 restart oslikinet

x=1000; y=(x/100)*3.9 + 0.35; z=(x/100)*5+0.5;  x+y+z= 

*/

// NODE_ENV=development
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


\/- hosting 
\/- deploy (secret key captcha + sendgrid)

\/- email oslikinet (5$)
\/- page count limit
\/- caprtcha under button
\/- subsc если ты разлогинен на зареганый емайл


\/- loading on search trip
\/- loading on login
?- zero dialogs
\/- nginx cache

\/- pm2 product
\/- paypal
	\/- validation
	\/- credit cards
	
	
\/- reload captcha on error
\/- support link

\/- http://osliki.net/messages (admin)
??- donsk invoice
- browser back on invoice modal
\/- double messgaes in dialogs
	- check add msg to order
	- check /last/:lastId/order/:id
	- check new status
	- check pay
	- check unique indexes on product server db.orders.find({ trip: ObjectId('56d42a6ab2be09ac1c32f372'), user: ObjectId('56afbf3fad0a5d4416d152b7') }).explain('executionStats');
	
- help baloons

- mobile browser detect
- indexes db
- ssl https://www.digitalocean.com/community/tutorials/how-to-secure-nginx-with-let-s-encrypt-on-ubuntu-14-04

- soc share


- tests











- iptables





*/

    /*"angular2": "2.0.0-beta.0", */
    /*"es6-promise": "^3.0.2",
    "es6-shim": "^0.33.3",*/	    /*"reflect-metadata": "0.1.2",
    "rxjs": "5.0.0-beta.0",*/    /*"systemjs": "0.19.6",
    "zone.js": "0.5.10"*/


var winston = require('winston');
var path = require('path');
 
winston.handleExceptions(new winston.transports.File({
	filename: path.join(__dirname, 'logs/exceptions.log'),
	handleExceptions: true,
	humanReadableUnhandledException: true,
	exitOnError: false
}));

var express = require('express');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var mongoose = require('mongoose');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var MongoStoreSession = require('connect-mongo')(session);
var bodyParser = require('body-parser');

var config = require('./config');

var routes = require('./routes/index');
var users = require('./routes/users');
var trips = require('./routes/trips');
var orders = require('./routes/orders');
var messages = require('./routes/messages');
var reviews = require('./routes/reviews');
var subscribes = require('./routes/subscribes');
var invoices = require('./routes/invoices');

var app = express();

app.set( 'env', (process.env.NODE_ENV === 'development' ? 'development' : 'production') );
app.set( 'isDev', app.get('env') === 'development' );

console.log('NODE_ENV = ', process.env.NODE_ENV );
console.log('env = ', app.get('env') );
console.log('isDev = ', app.get('isDev') );

var logger = new (winston.Logger)({
    transports: [
		new (winston.transports.File)({
			filename: path.join(__dirname, 'logs/db.log')
		})
    ],
	exitOnError: false
});

// var mongoPath = (app.get('isDev') ? config.mongo.pathDev : config.mongo.path);
var mongoPath = config.mongo.path;

var mongoParams = {
	server: {
		auto_reconnect: true,
		socketOptions: {
			keepAlive: 120
		}
	},
	auth: {
		authdb: 'admin'
	},
	config: {
		autoIndex: true
	}
};

mongoose.connect(mongoPath, mongoParams, function(err) {
	if (err) {
		console.error(err);
		logger.error(err, {line: 160});
	}
});

//We have a pending connection to the test database running on localhost. We now need to get notified if we connect successfully or if a connection error occurs:

var db = mongoose.connection;

db.on('error', function(callback) {
	console.error('connection error');
	logger.error('connection error', {line: 169});
});

db.once('open', function(callback) {
	console.log('Mongo connection = opened');
});

var passwordless = require('passwordless');
// var MongoStorePasswordless = require('passwordless-mongostore-bcrypt-node');
var MongoStorePasswordless = require(app.get('isDev') ? 'passwordless-mongostore-bcrypt-node' : 'passwordless-mongostore');

mongoParams.mongostore = {
	collection: config.passwordless.collection
};

passwordless.init(new MongoStorePasswordless(mongoPath, mongoParams), {
	userProperty: config.passwordless.userProperty
});

passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback, req) {
	req.passwordless = req.passwordless || {};
	req.passwordless.tokenToSend = tokenToSend;
	req.passwordless.uidToSend = uidToSend;
	req.passwordless.recipient = recipient;
	callback();
}, {
	ttl: config.passwordless.ttl //app.get('passwordlessTTL')	
});








app.locals.title = config.name;
//app.locals.strftime = require('strftime');
app.locals.email = config.email;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

if ( app.get('isDev') ) {
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

if ( !app.get('isDev') ) {
	// app.set('trust proxy', 1) // trust first proxy
	// sessionParam.cookie.secure = true // serve secure cookies
}

app.use( session(sessionParam) );
/* Session ***/


if ( app.get('isDev') ) {
	app.use( express.static( path.join(__dirname, '../public') ) );
	// app.use( express.static( path.join(__dirname, '../node_modules') ) );
	app.use('/node_modules',      express.static(path.join(__dirname, '../node_modules')));
	
	// app.use(express.static(path.join(__dirname, 'node_modules')));
	// app.use(express.static(path.join(__dirname, 'scripts')));
	// app.use('/node_modules/ng2-datepicker', express.static(__dirname + '/node_modules/ng2-datepicker'));
	// app.use('/modules/moment', express.static(__dirname + '/node_modules/moment'));


	/*app.use('/modules/bootstrap', express.static(path.join(__dirname, '../node_modules/bootstrap/dist')));
	app.use('/modules/angular2',  express.static(path.join(__dirname, '../node_modules/angular2/bundles')));
	app.use('/modules/systemjs',  express.static(path.join(__dirname, '../node_modules/systemjs/dist')));
	app.use('/modules/rxjs',      express.static(path.join(__dirname, '../node_modules/rxjs/bundles')));*/
	app.use('/client_compiled',       express.static(path.join(__dirname, '../client_compiled')));
	app.use('/client_src',       express.static(path.join(__dirname, '../client_src')));
	// app.use('/scripts', express.static(path.join(__dirname, '/scripts')));
}

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
var Invoice = require('./models/invoice');

var locals = {
	orderStatus: JSON.stringify(Order.stsInv),
	orderStatusConst: JSON.stringify(Order.sts),
	invoiceStatus: JSON.stringify(Invoice.stsInv),
	invoiceStatusConst: JSON.stringify(Invoice.sts),
	recaptcha: config.recaptcha,
	fees: JSON.stringify(config.fees)
}

app.use(function(req, res, next) {
	res.locals = locals;
	res.locals.user = {
		id: req.session.uid,
		name: req.session.name,
		gravatar_hash: req.session.gravatar_hash
	};

	if (req.session.uid) {
		req.session._uid = mongoose.Types.ObjectId(req.session.uid);
	}

	next();
});

app.use('/', routes);
app.use('/users', users);
app.use('/trips', trips);
app.use('/orders', orders);
app.use('/messages', messages);
app.use('/reviews', reviews);
app.use('/subscribes', subscribes);
app.use('/invoices', invoices); 

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if ( app.get('isDev') ) {
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

Angular2, Node.js, MongoDB, JavaScript, TypeScript, ES6, Jade, Bootsrap, HTML5, Nginx, DigitalOcean, Gulp.js, Mongoose.js, Express.js, rxjs, SendGrid, PayPal API

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

