var chai = require('chai');
var expect = chai.expect;
var supertest = require('supertest');  
var sinon = require('sinon');



process.env.NODE_ENV = 'test';
process.env.DEBUG = 'osliknet:*';


var config = require('../server/config');
var sendgrid = require('../server/libs/sendgrid');
var captcha = require('../server/libs/captcha');
var User = require('../server/models/user');
var Token = require('../server/models/token');
var Subscribe = require('../server/models/subscribe');


var recaptcha = 'qwqwq121212qwwqw';

var user = {
	email: 'mcattendlg@gmail.com',
	name: 'mcattendlg',
	gravatar_hash: 'dadd2c410f42d564046d46e75b51b6b9'
};



var captchaStub = sinon.stub(captcha, 'verify', function(response, cb) {
	cb(recaptcha === response);
});

var sendgridStub = sinon.stub(sendgrid, 'send');
sendgridStub.yields(null, {});



var app = require('../bin/www');
var agent = supertest.agent(app);

var clearDbTbls = function() {
	User.remove({}, function(err) { 
	   console.log('Users removed');
	});
	
	Token.remove({}, function(err) { 
	   console.log('Tokens removed');
	});	
}

describe('Users', function() {
	before(function() {
		clearDbTbls();
	});
	
	describe('#signup', function() {
		it('should return 400 cos captcha', function(done) {
			agent
				.post('/users/signup')
				.send({email: user.email, username: user.name})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Invalid captcha.'});
					expect(captchaStub.called).to.be.true;
					
					done();
				});
		});
		
		it('should return 400 cos invalid username', function(done) {
			agent
				.post('/users/signup')
				.send({email: user.email, name: false, recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Invalid user name.'});
					
					done();
				});
		});
		
		it('should return 400 cos empty name', function(done) {
			agent
				.post('/users/signup')
				.send({email: user.email, name: '', recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Invalid user name.'});
					
					done();
				});
		});
		
		it('should return 400 cos invalid email', function(done) {
			agent
				.post('/users/signup')
				.send({email: 2, name: user.name, recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Invalid email.'});
					
					done();
				});
		});
		
		it('should return 400 cos empty email', function(done) {
			agent
				.post('/users/signup')
				.send({name: user.name, recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Invalid email.'});
					
					done();
				});
		});
			
		it('should create a new user and send email', function(done) {
			agent
				.post('/users/signup')
				.send({email: user.email, name: user.name, recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);

					token = sendgridStub.args[0][0].text.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g)[0].replace(config.host, '/');

					expect(res.body).to.eql({msg: 'sent'});
					
					done();
				});
		});
		
		it('should return 400 cos diplicate name', function(done) {
			agent
				.post('/users/signup')
				.send({email: user.email, name: user.name, recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {

					
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Username is occupied.'});
					
					done();
				});
		});
		
		it('should return 400 cos diplicate email', function(done) {
			agent
				.post('/users/signup')
				.send({email: user.email, name: 'dddd', recaptcha: recaptcha})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Email is registered already.'});
					
					done();
				});
		});
	});
	
	var token = '';
	
	describe('#auth', function() {	
		it('should log in and redirect', function(done) {
			agent
				.get(token)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err);
					done();
				});
		});
		
		it('should get my user obj', function(done) {
			agent
				.get('/users/my')
				.set('X-Requested-With', 'XMLHttpRequest')
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);					
					
					expect(res.body.user.name).to.equal(user.name);
					
					done();
				});
		});

		it('should logout', function(done) {
			agent
				.get('/users/logout')
				.expect('Location', '/login')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err);
					done();
				});
		});
		
		it('should return text about expired token', function(done) {
			agent
				.get(token)
				.expect('Content-type', /text/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);

					expect(res.text).to.equal('The request token is invalid. It may have already been used, or expired because it is too old.');
					
					done();
				});
		});
		
		it('should not get my user obj', function(done) {
			agent
				.get('/users/my')
				.set('X-Requested-With', 'XMLHttpRequest')
				.expect('Content-type', /json/)
				.expect(401)
				.end(function(err, res) {
					if (err) return done(err);					
					
					expect(res.body).to.eql({error: 'Unauthorized'});
					
					done();
				});
		});
		
		it('should redirect on login cos unauth', function(done) {
			agent
				.get('/users/my')
				.expect('Location', '/users/login')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err);					

					done();
				});
		});

		it('should return 400 cos email not found', function(done) {
			agent
				.post('/users/login')
				.send({email: 'cxc@fdf.rt'})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err);
					
					expect(res.body).to.eql({error: 'Email not found.'});
					
					done();
				});
		});
		
		it('should send login token', function(done) {
			agent
				.post('/users/login')
				.send({email: user.email})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					
					token = sendgridStub.args[1][0].text.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g)[0].replace(config.host, '/');

					expect(res.body).to.eql({msg: 'sent'});
					
					done();
				});
		});
		
		it('should return 429 and refuse to send again a new token', function(done) {
			agent
				.post('/users/login')
				.send({email: user.email})
				.expect('Content-type', /json/)
				.expect(429)
				.end(function(err, res) {
					if (err) return done(err);					
					done();
				});
		});
		
		it('should again log in and redirect', function(done) {
			agent
				.get(token)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err);
					done();
				});
		});
		
		it('should behave as if logged in again', function(done) {
			agent
				.get(token)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err);
					done();
				});
		});
	});	
	
	describe('#other', function() {
		var uid = '';
		
		it('should update description', function(done) {
			agent
				.post('/users/update')
				.set('X-Requested-With', 'XMLHttpRequest')
				.set('Content-Type', 'application/json')
				.send({about: '123'})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);					
					
					expect(res.body.user.about).to.equal('123');
					expect(res.body.user).to.not.have.property('email');
					
					uid = res.body.user._id
					
					done();
				});
		});
		
		it('should get user obj', function(done) {
			agent
				.get('/users/' + uid)
				.set('X-Requested-With', 'XMLHttpRequest')
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);					

					expect(res.body.user.name).to.equal(user.name);
					expect(res.body.user.gravatar_hash).to.equal(user.gravatar_hash);
					expect(res.body.user.about).to.equal('123');
					expect(res.body.user).to.have.property('stats');
					expect(res.body.user).to.not.have.property('email');
					
					done();
				});
		});
		
		it('should render index', function(done) {
			agent
				.get('/users/' + uid)
				.expect('Content-type', /html/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err);
					
					done();
				});
		});
	});	
	
	after(function() {
		clearDbTbls();
	});
});


describe('Orders', function() {

});

describe('Invoices', function() {

});


/*					
					
					
					/*expect(err).to.equal(null);
					expect(res.body.success).to.equal(true);
					expect(res.body.user).to.be.an('object');
					expect(res.body.user.email).to.equal('test@test.com');
					// we will filter the user object and not return the 
					// password hash back
					expect(res.body.user.password).to.equal(undefined);*/
/* var supertest = require("supertest");
var should = require("should");

// This agent refers to PORT where program is runninng.

var server = supertest.agent("http://localhost:8080");

// UNIT test begin

describe("SAMPLE unit test",function(){

  // #1 should return home page

  it("should return home page", function(done) {

    // calling home page api
    server
    .get("/")
    .expect("Content-type",/html/)
    .expect(200) // THis is HTTP response
    .end(function(err,res){
      // HTTP status should be 200
      res.status.should.equal(200);
      // Error key should be false.
      // res.body.error.should.equal(false);
      done();
    });
  });

}); */

/*
var supertest = require('supertest');
var serverPath = '../bin/www';

require = require('really-need');

describe('loading express', function () {
	var server;
	
	beforeEach(function () {
		server = require(serverPath, { bustCache: true });
	});
	
	afterEach(function (done) {
		server.close(done);
	});
	
	it('responds to /', function testSlash(done) {
		supertest(server)
			.get('/')
			.expect(200, done);
	});
	
	it('404 everything else', function testPath(done) {
		supertest(server)
			.get('/foo/bar')
			.expect(404, done);
	});
});
*/

/*var mdlwares = proxyquire('../server/routes/users', {
	'../libs/mdlwares': mdlwaresStub
});*/

// var app = require('../bin/www');


/* var app = proxyquire('../bin/www', {
	'../libs/mdlwares': {
		checkCaptcha: function(req, res, next) {
			console.log('dfssssssssssssssssssssssssssssdffdf');
			next();
		}
	}
}); */
