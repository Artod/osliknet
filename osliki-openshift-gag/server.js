#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');


var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');

var session = require('express-session');
var MongoStoreSession = require('connect-mongo')(session);

var bodyParser = require('body-parser');


var mongoose = require('mongoose');


var Subscribe = require('./subscribe');
var Consts = require('./consts');





/**
 *  Define the sample application.
 */
var SampleApp = function() {

    //  Scope.
    var self = this;


    /*  ================================================================  */
    /*  Helper functions.                                                 */
    /*  ================================================================  */

    /**
     *  Set up server IP address and port # using env variables/defaults.
     */
    self.setupVariables = function() {
        //  Set the environment variables we need.
		

        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;
		
        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };		
		
		self.mongoHost = process.env.OPENSHIFT_MONGODB_DB_HOST;
		self.mongoPort = process.env.OPENSHIFT_MONGODB_DB_PORT;
		
			
		if (typeof self.mongoHost === "undefined") {
			self.mongoHost = 'localhost';
        } else {
			self.mongoUserPass = Consts.mongoUser + ':' + Consts.mongoPass;			
		}

    };


    /**
     *  Populate the cache.
     */
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' };
        }

        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
    };


    /**
     *  Retrieve entry (content) from cache.
     *  @param {string} key  Key identifying content to retrieve from cache.
     */
    self.cache_get = function(key) { return self.zcache[key]; };


    /**
     *  terminator === the termination handler
     *  Terminate server on receipt of the specified signal.
     *  @param {string} sig  Signal to terminate on.
     */
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    /**
     *  Setup termination handlers (for exit and a list of signals).
     */
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };


    /*  ================================================================  */
    /*  App server functions (main app logic here).                       */
    /*  ================================================================  */

    /**
     *  Create the routing table entries + handlers for the application.
     */
    self.createRoutes = function() {
        self.routes = { };

        /*self.routes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.routes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };*/
    };


    /**
     *  Initialize the server (express) and create the routes and register
     *  the handlers.
     */
    self.initializeServer = function() {
		// TODO: MongoDB setup (given default can be used)
		var pathToMongoDb = 'mongodb://' + (self.mongoUserPass ? self.mongoUserPass + '@' : '') + self.mongoHost + (self.mongoPort ? ':' + self.mongoPort : '') + '/net';
		// "mongodb://<user>:<pass>@<host>:<port>/<db>"
		
// console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!!1')
// console.log(pathToMongoDb)

		mongoose.connect(pathToMongoDb);
		//We have a pending connection to the test database running on localhost. We now need to get notified if we connect successfully or if a connection error occurs:

		var db = self.db = mongoose.connection;
		
		db.on('error', console.error.bind(console, 'connection error:'));
		db.once('open', function(callback) {
			console.log('opened');
		});		
		
        self.createRoutes();
		
        var app = self.app = express();
	

		app.use(logger('dev'));
		app.use(bodyParser.json());
		app.use(bodyParser.urlencoded({ extended: true }));
		app.use(cookieParser());
		
		app.post('/add', function (req, res) {
			req.body.ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			
			var subscribe = new Subscribe(req.body);	
			
			subscribe.save(function (err, subscribe) {
				if (err) {
					res.status(err.name == 'ValidationError' ? 400 : 500)				
					
					res.type('json')
						.json({error: err});
						
					return;
				}
				
				res.type('json')
					.json({subscribe: {
						email: subscribe.email,
						created_at: subscribe.created_at						
					}});
			});
			
		});	 
		  
		
		self.app.get('/', function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            // res.send(self.cache_get('index.html') );
res.send(fs.readFileSync('./index.html'));

        });
		
        //  Add handlers for the app (from the routes).
       /* for (var r in self.routes) {
            self.app.get(r, self.routes[r]);
        }	*/
		
		app.use( express.static(path.join(__dirname, 'public')) );

		app.use(function(err, req, res, next) {
		  res.status(err.status || 500);
		  res.render('error', {
			message: err.message,
			error: {}
		  });
		});		
    };


    /**
     *  Initializes the sample application.
     */
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    /**
     *  Start the server (starts up the sample application).
     */
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

};   /*  Sample Application.  */



/**
 *  main():  Main code.
 */
var zapp = new SampleApp();
zapp.initialize();
zapp.start();

