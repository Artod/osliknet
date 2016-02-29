/*

TODO:

\/- Statuses
\/- Check comments
\/- Notification
\/- router.post('/add'
	\/- send email to traveler
	\/- inc order counter
	
- Profile
- Reviews + 
\/-rating

- TripPage + edit
- Subscribe on new trips
- Paging

\/- textarea везде maxlength: 2000

- Calendar css
\/- Modal css
- Index page

- Logging errors
\/- hide request delivery button if there is order already

- unauth middleware
- check auth (session.uid)
- beforeRouterFilter !req.xhr ? res.render('index')


- pre('save' created_at переделать
- logged in already убрать 
- not found error on query



- iptables



*/




var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
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

var app = express();

var mongoose = require('mongoose');
// TODO: MongoDB setup (given default can be used)
var pathToMongoDb = 'mongodb://localhost/osliknet';

mongoose.connect(pathToMongoDb);
//We have a pending connection to the test database running on localhost. We now need to get notified if we connect successfully or if a connection error occurs:

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(callback) {
  // yay!
});








var passwordless = require('passwordless');


var MongoStorePasswordless = require('passwordless-mongostore-bcrypt-node');


var sendgrid_api_key = 'v ftp';
var sendgrid  = require('sendgrid')(sendgrid_api_key);


var yourEmail = 'osliknet@gmail.com';
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
var host = 'http://localhost:3000/';

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


app.set('passwordlessTTL', 1000*60*30);

passwordless.init(new MongoStorePasswordless(pathToMongoDb, {
    mongostore: {
        collection: 'token'
	}
}), {
	userProperty: 'uid'	
});

passwordless.addDelivery(function(tokenToSend, uidToSend, recipient, callback) {
	var link = host + 'users/logged_in?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend);
	
	console.log(link);
	
	return;
	
	var email = new sendgrid.Email();
	
	email.addTo(recipient);
	email.subject = 'Token for ' + host;
	email.from = yourEmail;
	email.text = 'Hello!\nYou can now access your account here: ' + link;
	email.html = '<h1>Hello!</h1> \n <p>You can now access your account here: ' + '<a href="' + link + '">' + link + '</a></p>';
	
	sendgrid.send(email, function(err, json) {
		if (err) {
			console.log(err);
		}
		console.log(json);
		callback(err);
	});
	
	
	/*
	// Send out token
	smtpServer.send({
	   text: 'Hello!\nYou can now access your account here: ' 
			+ host + 'users/logged_in?token=' + tokenToSend + '&uid=' + encodeURIComponent(uidToSend), 
	   from: yourEmail, 
	   to: recipient,
	   subject: 'Token for ' + host
	}, function(err, message) { 
		if (err) {
			console.log(err);
		}
		
		callback(err);
	});
	*/
}, {
	ttl: app.get('passwordlessTTL')	
});








app.locals.title = 'OslikNet';
//app.locals.strftime = require('strftime');
app.locals.email = 'osliknet@gmail.com';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


/*** Session */
var sessionParam = {
	secret: '42secret!!!!!!!!!!!!!!!!!!!!!',
	cookie: {
		maxAge: 1000 * 60 * 60 * 24 * 30
	},
	store: new MongoStoreSession({
		mongooseConnection: db,
		touchAfter: 24 * 3600 // time period in seconds. To be updated only one time in a period of 24 hours	
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


app.use( express.static( path.join(__dirname, 'public') ) );
// app.use(express.static(path.join(__dirname, 'node_modules')));
// app.use(express.static(path.join(__dirname, 'scripts')));
app.use('/node_modules/ng2-datepicker', express.static(__dirname + '/node_modules/ng2-datepicker'));
app.use('/modules/moment', express.static(__dirname + '/node_modules/moment'));
app.use('/modules/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/modules/angular2', express.static(__dirname + '/node_modules/angular2/bundles'));
app.use('/modules/systemjs', express.static(__dirname + '/node_modules/systemjs/dist'));
app.use('/modules/rxjs', express.static(__dirname + '/node_modules/rxjs/bundles'));
app.use('/app', express.static(__dirname + '/app'));
// app.use('/scripts', express.static(path.join(__dirname, '/scripts')));

// Passwordless middleware
app.use(passwordless.sessionSupport());
// app.use(passwordless.acceptToken({ successRedirect: '/successRedirect', failureRedirect: '/errorredir' }));
 
app.set('orderStatus', {
	5: 'Negotiation',
	10: 'Processing',
	15: 'Refused',
	20: 'Cancelled',
	25: 'Finished'
});

app.set('orderStatusConst', require('./models/order').sts);

app.use(function (req, res, next) {
	res.locals = {
		user: {
			id: req.session.uid,
			name: req.session.name
		},
		orderStatus: app.get('orderStatus'),
		orderStatusConst: app.get('orderStatusConst')
	};
   
   next();
});


app.use('/', routes);
app.use('/users', users);
app.use('/trips', trips);
app.use('/orders', orders);
app.use('/messages', messages);
app.use('/reviews', reviews);


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

