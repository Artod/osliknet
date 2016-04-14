/*
- trips get('/:id' unauth
- check all methods auth unauth 
*/



var chai = require('chai') 
var expect = chai.expect 
var supertest = require('supertest')   
var sinon = require('sinon') 
var async = require('async') 
var moment = require('moment') 
// var proxyquire =  require('proxyquire') 

process.env.NODE_ENV = 'test' 
process.env.DEBUG = 'osliknet:*' 


var config = require('../server/config') 
var sendgrid = require('../server/libs/sendgrid') 
var captcha = require('../server/libs/captcha') 

var Subscribes = require('../server/models/subscribe') 
var User = require('../server/models/user') 
var Token = require('../server/models/token') 
var Subscribe = require('../server/models/subscribe') 
var Trip = require('../server/models/trip') 

var getUid = (function() {
	var id = 0 
	return function() {
		getUid.lastUid = ++id 
		return getUid.lastUid 
	}
})() 
getUid.lastUid = 0 

var mock = {
	user: { // tripper
		email: 'mcattendlg@gmail.com',
		name: 'mcattendlg',
		gravatar_hash: 'dadd2c410f42d564046d46e75b51b6b9'
	},
	user2: { // customer
		email: 'gartod@gmail.com',
		name: 'artod',
		gravatar_hash: 'ef8bc60f0350df430a75ef30e68fe7b5'
	},
	user3: { // always guest
		email: 'user3@gmail.com'
	},
	user4: { // just passive auth user
		email: 'user4@gmail.com',
		name: 'user4',
	},
	trip: {
		from: 'Montreal, QC, Canada',
		from_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU',
		to: 'Moscow, Russia',
		to_id: 'ChIJybDUc_xKtUYRTM9XV8zWRD0'
	} 
}


var captchaStub = sinon.stub(captcha, 'verify') 
captchaStub.yields(true) 

var sendgridStub = sinon.stub(sendgrid, 'send') 
sendgridStub.yields(null, {}) 

// var clock = sinon.useFakeTimers()


var app = require('../bin/www')

var agent = supertest.agent(app) 
var agent2 = supertest.agent(app)
var agent3 = supertest.agent(app)
var agent4 = supertest.agent(app)

var clearDbTbls = function() {
	User.remove({}, function(err) { 
	   console.log('Users removed') 
	})
	
	Token.remove({}, function(err) { 
	   console.log('Tokens removed') 
	})	
	
	Subscribes.remove({}, function(err) { 
	   console.log('Subscribes removed') 
	})
	
	Trip.remove({}, function(err) { 
	   console.log('Trips removed') 
	})
}

var getLinks = function(text) {
	return text.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g)
}

var getLastEmail = function() {
	return sendgridStub.args[sendgridStub.args.length - 1][0].text
}

var subscrId1
var subscrId3


before(function() {
	clearDbTbls() 
}) 


describe('Unauth Trips and Subscribes', function() {
	it('should get empty array of trips without subscribe', function(done) {
		agent
			.get('/trips?from_id=' + mock.trip.from_id + '&to_id=' + mock.trip.to_id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body).to.eql({trips: []}) 
				
				done() 
			}) 
	})

	it('should not create a new subscribe cos empty to_id', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from_id: mock.trip.from_id,
				email: mock.user.email,
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(400)
			.end(function(err, res) {
				if (err) return done(err) 
				
				done() 
			}) 
	}) 
	
	it('should not create a new subscribe cos empty email', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from_id: mock.trip.from_id,
				to_id: mock.trip.to_id,
				email: '',
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(500)
			.end(function(err, res) {
				if (err) return done(err) 
				
				done() 
			}) 
	}) 
	
	it('should create a subscribe for user1', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
				to_id: mock.trip.to_id,
				email: mock.user.email,
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 

				expect( captchaStub.args[captchaStub.args.length - 1][0] ).to.be.equal(getUid.lastUid) 
				expect(res.body.subscribe).to.have.property('email') 
				expect(res.body.subscribe).to.not.have.property('user') 
				expect(res.body.subscribe.from_id).to.equal(mock.trip.from_id) 
				expect(res.body.subscribe.to_id).to.equal(mock.trip.to_id) 
				
				subscrId1 = res.body.subscribe._id;
				
				done() 
			}) 
	})
	
	it('should create a subscribe for user2', function(done) {
		agent2
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
				to_id: mock.trip.to_id,
				email: mock.user2.email,
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.subscribe.email).to.be.equal(mock.user2.email)
				
				done() 
			}) 
	}) 
	
	it('should create a subscribe for user3', function(done) {
		agent3
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
				to_id: mock.trip.to_id,
				email: mock.user3.email,
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.subscribe.email).to.be.equal(mock.user3.email)
				
				subscrId3 = res.body.subscribe._id;
				
				done() 
			}) 
	}) 
	
	it('should unsubscribe unauth user1', function(done) {
		agent
			.get('/subscribes/cancel/' + subscrId1)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				Subscribe.findById(subscrId1).select('is_unsubed').exec(function(err, subscribe) {
					if (err) return done(err)
					
					expect(subscribe.is_unsubed).to.be.true
					
					done() 
				})
			}) 
	})

	it('should not create a new subscribe cos duplicate just set flag', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from_id: mock.trip.from_id,
				to_id: mock.trip.to_id,
				email: mock.user.email,
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 

				expect(res.body.subscribe).to.not.have.property('email') 
				expect(res.body.subscribe).to.not.have.property('user') 
				expect(res.body.subscribe.from_id).to.equal(mock.trip.from_id) 
				expect(res.body.subscribe.to_id).to.equal(mock.trip.to_id) 
				
				Subscribe.find({
					from_id: mock.trip.from_id,
					to_id: mock.trip.to_id,
					email: mock.user.email
				}).select('is_unsubed').exec(function(err, subscribes) {
					if (err) return done(err)
						
					expect(subscribes[0].is_unsubed).to.be.false
					expect( subscribes[0]._id.toString() ).to.be.equal(subscrId1)
					expect(subscribes.length).to.equal(1) 
					
					done()
				})
			}) 
	}) 	

	
})

describe('Users', function() {
	var loginLink1 
	var loginLink2
	var loginLink4

	describe('#signup', function() {	
		it('should return 400 cos invalid username', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({email: mock.user.email, name: false, recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err) 					
					
					expect(res.body).to.eql({error: 'Invalid user name.'}) 					
					
					done() 
				}) 
		}) 
		
		it('should return 400 cos empty name', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({email: mock.user.email, name: '', recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err) 
					
					expect(res.body).to.eql({error: 'Invalid user name.'}) 
					
					done() 
				}) 
		}) 
		
		it('should return 400 cos invalid email', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({email: 2, name: mock.user.name, recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err) 
					
					expect(res.body).to.eql({error: 'Invalid email.'}) 
					
					done() 
				}) 
		}) 
		
		it('should return 400 cos empty email', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({name: mock.user.name, recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err) 
					
					expect(res.body).to.eql({error: 'Invalid email.'}) 
					
					done() 
				}) 
		}) 
			
		it('should create a new user1 and send email', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({email: mock.user.email, name: mock.user.name, recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err)				

					loginLink1 = getLinks( getLastEmail() )[0].replace(config.host, '/')
					
					expect( captchaStub.args[captchaStub.args.length - 1][0] ).to.be.equal(getUid.lastUid)
					expect(res.body).to.eql({msg: 'sent'}) 
					
					User.findOne({email: mock.user.email}).select('is_approved').exec(function(err, user) {
						if (err) return done(err)
							
						expect(user.is_approved).to.be.false
						
						done() 
					});
				}) 
		})
		
		it('should create a new user2 and send email', function(done) {
			agent2
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({
					email: mock.user2.email,
					name: mock.user2.name,
					recaptcha: getUid()
				})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err)
						
					loginLink2 = getLinks( getLastEmail() )[0].replace(config.host, '/')
					
					done()
				}) 
		})
		
		it('should create a new user4 and send email', function(done) {
			agent4
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({
					email: mock.user4.email,
					name: mock.user4.name,
					recaptcha: getUid()
				})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err)
						
					loginLink4 = getLinks( getLastEmail() )[0].replace(config.host, '/')
					
					done()
				}) 
		})
		
		it('should return 400 cos diplicate name', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({email: mock.user.email, name: mock.user.name, recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {

					
					if (err) return done(err) 
					
					expect(res.body).to.eql({error: 'Username is occupied.'}) 
					
					done() 
				}) 
		}) 
		
		it('should return 400 cos diplicate email', function(done) {
			agent
				.post('/users/signup')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({email: mock.user.email, name: 'dddd', recaptcha: getUid()})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err) 
					
					expect(res.body).to.eql({error: 'Email is registered already.'}) 
					
					done() 
				}) 
		}) 
	}) 
	
	describe('#auth', function() {	
		it('should log in user and redirect', function(done) {
			agent
				.get(loginLink1)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err)
						
					User.findOne({email: mock.user.email}).exec(function(err, user) {
						mock.user.id = user.id
						mock.user._id = user._id
					})
					
					done()
				}) 
		})
		
		it('should log in user2 and redirect', function(done) {
			agent2
				.get(loginLink2)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err)
						
					User.findOne({email: mock.user2.email}).exec(function(err, user) {
						mock.user2.id = user.id
						mock.user2._id = user._id
					})
					
					done()
				}) 
		})
		
		it('should log in user4 and redirect', function(done) {
			agent4
				.get(loginLink4)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err)
						
					User.findOne({email: mock.user4.email}).exec(function(err, user) {
						mock.user4.id = user.id
						mock.user4._id = user._id
					})
					
					done()
				}) 
		})
		
		it('should get my user obj with is_approved=true and tied unauth subscribes', function(done) {
			agent
				.get('/users/my')
				.set('X-Requested-With', 'XMLHttpRequest')
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err) 					
					
				
					expect(res.body.user.name).to.equal(mock.user.name)
					
					async.parallel({
						user: function(cb) {
							User.findById(res.body.user._id).select('is_approved').exec(function(err, user) {
								if (err) return cb(err)
									
								expect(user.is_approved).to.be.true
								
								cb(null, user) 
							});
						},
						subscribe: function(cb) {
							Subscribe.find({
								email: mock.user.email
							}).select('user').exec(function(err, subscribes) {
								if (err) return cb(err)
									
								subscribes.forEach(function(subscribe) {
									expect( subscribe.user.toString() ).to.be.equal(res.body.user._id)
								})
								
								cb(null, subscribes)
							});
							
						}
					
					}, function(err, asyncRes) {
						if (err) return done(err)
							
						done()
					})
				}) 
		}) 

		it('should logout', function(done) {
			agent
				.get('/users/logout')
				.expect('Location', '/login')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err) 
					done() 
				}) 
		}) 
		
		it('should return text about expired token', function(done) {
			agent
				.get(loginLink1)
				.expect('Content-type', /text/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err) 

					expect(res.text).to.equal('The request token is invalid. It may have already been used, or expired because it is too old.') 
					
					done() 
				}) 
		}) 
		
		it('should not get my user obj', function(done) {
			agent
				.get('/users/my')
				.set('X-Requested-With', 'XMLHttpRequest')
				.expect('Content-type', /json/)
				.expect(401)
				.end(function(err, res) {
					if (err) return done(err) 					
					
					expect(res.body).to.eql({error: 'Unauthorized'}) 
					
					done() 
				}) 
		}) 
		
		it('should redirect on login cos unauth', function(done) {
			agent
				.get('/users/my')
				.expect('Location', '/users/login')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err) 					

					done() 
				}) 
		}) 

		it('should return 400 cos email not found', function(done) {
			agent
				.post('/users/login')
				.set('X-Requested-With', 'XMLHttpRequest')
				.set('Content-Type', 'application/json')
				.send({email: 'cxc@fdf.rt'})
				.expect('Content-type', /json/)
				.expect(400)
				.end(function(err, res) {
					if (err) return done(err) 
					
					expect(res.body).to.eql({error: 'Email not found.'}) 
					
					done() 
				}) 
		})
		
		it('should send again a new token for user1', function(done) {
			agent
				.post('/users/login')
				.set('X-Requested-With', 'XMLHttpRequest')
				.set('Content-Type', 'application/json')
				.send({email: mock.user.email})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err)
						
					loginLink1 = getLinks( getLastEmail() )[0].replace(config.host, '/')
						
					done() 
				}) 
		})
		
		it('should return 429 and refuse to send again a new token', function(done) {
			agent
				.post('/users/login')
				.set('X-Requested-With', 'XMLHttpRequest')
				.set('Content-Type', 'application/json')
				.send({email: mock.user.email})
				.expect('Content-type', /json/)
				.expect(429)
				.end(function(err, res) {
					if (err) return done(err) 					
					done() 
				}) 
		}) 
		
		it('should again log in and redirect', function(done) {
			agent
				.get(loginLink1)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err) 
					done() 
				}) 
		}) 
		
		it('should behave as if logged in again', function(done) {
			agent
				.get(loginLink1)				
				.expect('Location', '/users/my')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err) 
					done() 
				}) 
		}) 
	})
	
	describe('#other', function() {
		
		it('should update description', function(done) {
			agent
				.post('/users/update')
				.set('X-Requested-With', 'XMLHttpRequest')
				.set('Content-Type', 'application/json')
				.send({about: '123'})
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err) 					
					
					expect(res.body.user._id).to.equal(mock.user.id) 
					expect(res.body.user.about).to.equal('123') 
					expect(res.body.user).to.not.have.property('email') 
					
					done() 
				}) 
		}) 
		
		it('should get user obj', function(done) {
			agent
				.get('/users/' + mock.user.id)
				.set('X-Requested-With', 'XMLHttpRequest')
				.expect('Content-type', /json/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err) 					

					expect(res.body.user.name).to.equal(mock.user.name) 
					expect(res.body.user.gravatar_hash).to.equal(mock.user.gravatar_hash) 
					expect(res.body.user.about).to.equal('123') 
					expect(res.body.user).to.have.property('stats') 
					expect(res.body.user).to.not.have.property('email') 
					
					done() 
				}) 
		}) 
		
		it('should render index', function(done) {
			agent
				.get('/users/' + mock.user.id)
				.expect('Content-type', /html/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err) 
					
					done() 
				}) 
		}) 
	}) 
	
})

describe('Auth Trips and Subscribes', function() {
	it('should get empty array of trips with subscribe', function(done) {
		agent
			.get('/trips?from_id=' + mock.trip.from_id + '&to_id=' + mock.trip.to_id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.trips.length).to.be.equal(0)
				expect(res.body.subscribe._id).to.not.be.empty
				
				done() 
			}) 
	})
	
	it('should unsubscribe auth user1', function(done) {
		agent
			.get('/subscribes/cancel/' + subscrId1)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				Subscribe.findById(subscrId1).select('is_unsubed').exec(function(err, subscribe) {
					if (err) return done(err)
					
					expect(subscribe.is_unsubed).to.be.true
					
					done() 
				})
			}) 
	})
	
	it('should subscribe again', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from_id: mock.trip.from_id,
				to_id: mock.trip.to_id
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 

				Subscribe.findById(subscrId1).select('is_unsubed').exec(function(err, subscribe) {
					if (err) return done(err)
					
					expect(subscribe.is_unsubed).to.be.false
					
					done() 
				})
			}) 
	})
});

describe('Trips', function() {
	it('should render index on get /trips/add', function(done) {
		agent
			.get('/trips/add')
			.expect('Content-type', /html/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 
				
				done() 
			}) 
	}) 
	
	it('should not create a new trip cos invalid date', function(done) {
		agent
			.post('/trips/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
				to_id: mock.trip.to_id,
				when: moment().subtract(1, 'days').format('YYYY.MM.DD'),
				description: 'test descr'
			})
			.expect('Content-type', /json/)
			.expect(500)
			.end(function(err, res) {
				if (err) return done(err) 

				done()
			})
	});
	
	it('should create a new trip1 + sets stats and notifications', function(done) {
		agent
			.post('/trips/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
				to_id: mock.trip.to_id,
				when: moment().format('YYYY.MM.DD'),
				description: 'test descr'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				mock.trip.id = res.body.trip._id
			
				setTimeout(function() {
					var links = getLinks( getLastEmail() )
					
					var newTripLink = links[0].replace(config.host, '/')					
					expect(newTripLink).to.be.equal('/trips/' + res.body.trip._id)
					
					var cancelUnsub = links[1].replace(config.host, '/')					
					expect(cancelUnsub).to.be.equal('/subscribes/cancel/' + subscrId3)					
					

					async.parallel({
						tripperStats: function(cb) {
							User.findById(mock.user._id).select('stats.t_cnt').exec(function(err, user) {

								expect(user.stats.t_cnt).to.be.equal(1)
								
								cb(err, user)				
							})							
						},
						subscriberNotification: function(cb) {
							User.findById(mock.user2._id).select('newTrips needEmailNotification').exec(function(err, user) {
									
								expect(user.newTrips).to.be.eql([res.body.trip._id.toString()])
								expect(user.needEmailNotification).to.be.true
								
								cb(err, user)
							})
							
						}
					}, function(err, asyncRes) {
						if (err) return done(err)
							
						done()	
					})				

					
				}, 500)	
			})
	});

	it('should get my trips for user1', function(done) {
		agent
			.get('/trips/my')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.trips).to.be.an('array')
				expect(res.body.orders).to.be.an('array')			
				
				expect(res.body.trips.length).to.be.equal(1)
				expect(res.body.orders.length).to.be.equal(0)
				
				expect(res.body.trips[0]._id).to.be.exist
				expect(res.body.trips[0].user).to.be.a('string')
				expect(res.body.trips[0].to_id).to.be.equal(mock.trip.to_id)
				expect(res.body.trips[0].from_id).to.be.equal(mock.trip.from_id)
				
				done() 
			}) 
	})
	
	it('should get empty my trips for user2', function(done) {
		agent2
			.get('/trips/my')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body).to.be.eql({trips: [], orders: []})
				
				done() 
			}) 
	})
	
	it('should get trip for user1', function(done) {
		agent
			.get('/trips/' + mock.trip.id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.trip).to.be.an('object')
				expect(res.body.orders).to.be.an('array')			
				expect(res.body).to.not.have.property('subscribe')
				
				expect(res.body.trip._id).to.be.exist
				expect(res.body.orders.length).to.be.equal(0)
				
				done() 
			}) 
	})
	
	it('should get trip for user2', function(done) {
		agent2
			.get('/trips/' + mock.trip.id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.trip).to.be.an('object')
				expect(res.body).to.have.property('subscribe')
				expect(res.body).to.not.have.property('orders')
				
				expect(res.body.trip._id).to.be.exist
				expect(res.body.trip.user).to.have.property('_id')
				expect(res.body.trip.user).to.not.have.property('email')
				
				User.findById(mock.user2._id).select('newTrips needEmailNotification').exec(function(err, user) {
					if (err) return done(err)
						
					expect(user.newTrips).to.be.eql([])
					expect(user.needEmailNotification).to.be.false
					
					done()
				})
			})
	})
	
	it('should get trip for user3', function(done) {
		agent3
			.get('/trips/' + mock.trip.id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.trip).to.be.an('object')
				expect(res.body).to.not.have.property('subscribe')
				expect(res.body).to.not.have.property('orders')
				
				expect(res.body.trip._id).to.be.exist
				expect(res.body.trip.user).to.have.property('_id')
				expect(res.body.trip.user).to.not.have.property('email')
				
				done() 
			}) 
	})
	
	it('should update trip1 for user1', function(done) {
		agent
			.post('/trips/update')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				description: '123123123',
				id: mock.trip.id
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.trip.description).to.be.equal('123123123')
				
				done() 
			}) 
	})	
	
	it('should not update trip1 for user2', function(done) {
		agent2
			.post('/trips/update')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				description: '123123123',
				id: mock.trip.id
			})
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err)
				done() 
			}) 
	})
}) 

describe('Orders', function() {
	it('should get empty array of orders for user1', function(done) {
		agent
			.get('/orders')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.orders).to.be.an('array')
				expect(res.body.orders.length).to.be.equal(0)
				
				done() 
			})
	})
	
	it('should not create order for user1', function(done) {
		agent
			.post('/orders/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				trip: mock.trip.id,
				message: '123123123'
			})
			.expect('Content-type', /json/)
			.expect(400)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body).to.be.eql({error: 'Order to the own trip.'})
				
				done() 
			}) 
	})
	
	it('should create order for user2', function(done) {
		agent2
			.post('/orders/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				trip: mock.trip.id,
				message: '123123123'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.order.message).to.be.equal('123123123')
				
				setTimeout(function() {
					async.parallel({
						tripperStats: function(cb) {
							User.findById(mock.user._id).select('stats.t_order').exec(function(err, user) {

								expect(user.stats.t_order).to.be.equal(1)
								
								cb(err, user)				
							})							
						},
						customerStats: function(cb) {
							User.findById(mock.user2._id).select('stats.r_cnt').exec(function(err, user) {

								expect(user.stats.r_cnt).to.be.equal(1)
								
								cb(err, user)				
							})							
						},
						notification: function(cb) {
							User.findById(mock.user._id).select('newOrders needEmailNotification').exec(function(err, user) {
									
								expect(user.newOrders).to.be.eql([res.body.order._id.toString()])
								expect(user.needEmailNotification).to.be.true
								
								cb(err, user)
							})							
						}
					}, function(err, asyncRes) {
						if (err) return done(err)
							
						done()	
					})	
				}, 500)
			}) 
	})
	
	it('should not create second order for user2', function(done) {
		agent2
			.post('/orders/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				trip: mock.trip.id,
				message: '123123123'
			})
			.expect('Content-type', /json/)
			.expect(400)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body).to.be.eql({error: 'Only one order allowed.'})
				
				done()
			}) 
	})
	
	it('should return array of orders for user1', function(done) {
		agent
			.get('/orders')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.orders).to.be.an('array')
				expect(res.body.orders.length).to.be.equal(1)
				expect(res.body.orders[0].trip._id).to.be.equal(mock.trip.id)
				expect(res.body.orders[0].tripUser._id).to.be.equal(mock.user.id)
				expect(res.body.orders[0].tripUser).to.not.have.property('email')
				expect(res.body.orders[0].user._id).to.be.equal(mock.user2.id) 
				expect(res.body.orders[0].user).to.not.have.property('email')
				
				setTimeout(function() {
					User.findById(mock.user._id).select('newOrders needEmailNotification').exec(function(err, user) {
						if (err) return done(err) 
							
						expect(user.newOrders).to.be.eql([])
						expect(user.needEmailNotification).to.be.false
						
						done()
					})	
				}, 500)
			})
	})
	
	it('should return array of orders for user2', function(done) {
		agent2
			.get('/orders')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.orders).to.be.an('array')
				expect(res.body.orders.length).to.be.equal(1)
				expect(res.body.orders[0].trip._id).to.be.equal(mock.trip.id)
				expect(res.body.orders[0].tripUser._id).to.be.equal(mock.user.id)
				expect(res.body.orders[0].tripUser).to.not.have.property('email')
				expect(res.body.orders[0].user._id).to.be.equal(mock.user2.id)
				expect(res.body.orders[0].user).to.not.have.property('email')
				
				setTimeout(function() {
					User.findById(mock.user2._id).select('newOrders needEmailNotification').exec(function(err, user) {
						if (err) return done(err) 
							
						expect(user.newOrders).to.be.eql([])
						expect(user.needEmailNotification).to.be.false
						
						done()
					})	
				}, 500)
			})
	})
	
	it('should not return order for user1', function(done) {
		agent
			.get('/orders/trip/' + mock.trip.id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.order).to.be.a('null')
				
				done()
			})
	})
	
	it('should return order for user2', function(done) {
		agent2
			.get('/orders/trip/' + mock.trip.id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body.order.trip).to.be.a('string')
				expect(res.body.order.user).to.be.a('string')
				expect(res.body.order.tripUser).to.be.a('string')
				
				done()
			})
	})
}) 

describe('Invoices', function() {

}) 


after(function() {
	clearDbTbls() 
}) 



