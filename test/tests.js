/*

// - search old trips
// - msg 
// - notific
// - all stats in the end
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
var payments = require('../server/libs/payments');

var Subscribes = require('../server/models/subscribe') 
var User = require('../server/models/user') 
var Token = require('../server/models/token') 
var Subscribe = require('../server/models/subscribe') 
var Trip = require('../server/models/trip') 
var Order = require('../server/models/order') 
var Review = require('../server/models/review') 
var Message = require('../server/models/message') 
var Invoice = require('../server/models/invoice') 
var Private = require('../server/models/private') 


var captchaStub = sinon.stub(captcha, 'verify') 
captchaStub.yields(true) 

var sendgridStub = sinon.stub(sendgrid, 'send') 
sendgridStub.yields(null, {}) 

var paypalCreateSpy = sinon.spy(payments.paypal.payment, 'create') 
var paypalGetSpy = sinon.spy(payments.paypal.payment, 'get') 

var paypalExecuteStub = sinon.stub(payments.paypal.payment, 'execute')
var paypalExecuteRes = {
	transactions: [{
		related_resources: [{
			sale: {
				state: 'completed'
			}
		}]
	}]
}

paypalExecuteStub.yields(null, paypalExecuteRes)


// var clock = sinon.useFakeTimers()

/* console.dir(payments.getFees(100, 'USD'))
console.dir(payments.getFees(1000, 'CAD'))
console.dir(payments.getFees(0.001, 'EUR'))
console.dir(payments.getFees(0, 'USD'))
console.dir(payments.getFees(undefined, 'USD'))
console.dir(payments.getFees(100, 'TUG'))
console.dir( payments.getFees() )
console.dir(payments.getFees(37, 'RUB'))

return; */


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
	
	Order.remove({}, function(err) { 
	   console.log('Orders removed') 
	})
	
	Review.remove({}, function(err) { 
	   console.log('Reviews removed') 
	})
	
	Message.remove({}, function(err) { 
	   console.log('Messages removed') 
	})
	
	Private.remove({}, function(err) { 
	   console.log('Privates removed') 
	})
	
	Invoice.remove({}, function(err) { 
	   console.log('Invoices removed') 
	})	
}

var getLinks = function(text) {
	return text.match(/(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g)
}

var getLastEmail = function() {
	return sendgridStub.args[sendgridStub.args.length - 1][0].text
}

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
	},
	trip2: { // old trip
		from: 'Montreal, QC, Canada',
		from_id: 'ChIJDbdkHFQayUwR7-8fITgxTmU',
		to: 'Vancouver, BC, Canada',
		to_id: 'ChIJs0-pQ_FzhlQRi_OBm-qWkbs'
	},
	order: {
		
	},
	order2: { // for passed trip
		
	}
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

	it('should create a new subscribe without to_id', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				email: mock.user.email,
				recaptcha: getUid()
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 
				
				done() 
			}) 
	}) 

	it('should not create a new subscribe cos empty direction', function(done) {
		agent
			.post('/subscribes/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
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
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
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
	
	it('should unsubscribe unauth user1 via direct link', function(done) {
		agent
			.get('/subscribes/cancel/' + subscrId1)
			.expect('Content-type', /html/)
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
				.expect('Location', '/users/login')
				.expect(302)
				.end(function(err, res) {
					if (err) return done(err) 
					done() 
				}) 
		}) 
		
		it('should return text about expired token', function(done) {
			agent
				.get(loginLink1)
				.expect('Content-type', /html/)
				.expect(200)
				.end(function(err, res) {
					if (err) return done(err) 

					// expect(res.text).to.equal('The request token is invalid. It may have already been used, or expired because it is too old.')
					
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
				from: mock.trip.from,
				from_id: mock.trip.from_id,
				to: mock.trip.to,
				to_id: mock.trip.to_id,
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

function checkNotifications(agent, prop, eql) {
	it('should get notifications', function(done) {
		agent
			.get('/users/notifications')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
				expect(typeof(prop) === 'function' ? prop(res.body) : res.body[prop]).to.be.eql(eql())
			
				done() 
			}) 
	})
}

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

					
				}, 100)	
			})
	});
	
	checkNotifications(agent, 'newTrips', function() {return []})
	checkNotifications(agent2, 'newTrips', function() {return [mock.trip.id]})

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
	
	checkNotifications(agent2, 'newTrips', function() {return []})
	
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

	it('should create a new trip2', function(done) {
		agent
			.post('/trips/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				from: mock.trip2.from,
				from_id: mock.trip2.from_id,
				to: mock.trip2.to,
				to_id: mock.trip2.to_id,
				when: moment().format('YYYY.MM.DD'),
				description: 'test descr 2'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				mock.trip2.id = res.body.trip._id
				done()
			})
	});
	
})

function changeTripOld(trip, isOld) {
	it('should make trip from ' + trip.from + ' to get ' + (isOld ? 'old' : 'new'), function(done) {
		var newDate = isOld ? moment().subtract(2, 'days').format('YYYY.MM.DD') : moment().format('YYYY.MM.DD')
		
		Trip.findById(trip.id).exec(function(err, trip) {
			trip.when = newDate
			trip.save(function(err, trip) {
				if (err) return done(err)
					
				//expect( new Date(trip.when).getTime() ).to.be.equal( new Date(newDate).getTime() )
				
				Trip.findById(trip.id).exec(function(err, trip) {
					expect( new Date(trip.when).getTime() ).to.be.equal( new Date(newDate).getTime() )
console.log('new date fir trip id = ' + trip.id + ' !!!!!!!!!!!!!!!!!!!!!')
console.log(trip.when)
					done()
				})
			})
		})
	})
}

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
	
	it('should not create order by user1', function(done) {
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
	
	it('should create order by user2', function(done) {
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
				
				mock.order = res.body.order
				
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
				}, 100)
			}) 
	})
	
	it('should not create second order by user2', function(done) {
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
	
	changeTripOld(mock.trip2, true)
	
	it('should not create order2 for user2 cos old trip', function(done) {
		agent2
			.post('/orders/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				trip: mock.trip2.id,
				message: '3333'
			})
			.expect('Content-type', /json/)
			.expect(400)
			.end(function(err, res) {
				if (err) return done(err) 				
				
				expect(res.body).to.be.eql({error: 'Trip is passed.'})
				
				done()
			}) 
	})
	
	checkNotifications(agent, 'newOrders', function() {return [mock.order._id]})
	
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
				}, 100)
			})
	})
	
	checkNotifications(agent, 'newOrders', function() {return []})
	checkNotifications(agent2, 'newOrders', function() {return []})
	
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
				}, 100)
			})
	})
	
	checkNotifications(agent2, 'newOrders', function() {return []})
	
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
				
				expect(res.body.order.status).to.be.equal(5)
				expect(res.body.order.trip).to.be.a('string')
				expect(res.body.order.user).to.be.a('string')
				expect(res.body.order.tripUser).to.be.a('string')
				
				done()
			})
	})
	
	changeTripOld(mock.trip2, false)
	
	it('should create order2 by user2', function(done) {
		agent2
			.post('/orders/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				trip: mock.trip2.id,
				message: '3333'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				mock.order2 = res.body.order

				done()
			}) 
	})
	
	checkNotifications(agent, 'newOrders', function() {return [mock.order2._id]})
	checkNotifications(agent2, 'newOrders', function() {return []})
	
	changeTripOld(mock.trip2, true)
	
	describe('status and reviews', function() {
	
		var changeStatusWithError = function(agent, status, user, ind) {
			it('should not allow ' + user + ' set status ' + status, function(done) {
				agent
					.post('/orders/status')
					.set('Content-Type', 'application/json')
					.set('X-Requested-With', 'XMLHttpRequest')
					.send({
						order: (ind === 2 ? mock.order2._id : mock.order._id),
						status: status
					})
					.expect('Content-type', /json/)
					.expect(401)
					.end(function(err, res) {
						if (err) return done(err) 				
						
						expect(res.body).to.be.eql({error: 'Unauthorized'})
						
						done()
					})
			})			
		}
		
		var changeStatusWithSuccess = function(agent, status, user, ind) {
			
			var getOid = function() {
				return (ind === 2 ? mock.order2._id : mock.order._id)
			}
			
			it('should allow ' + user + ' set status ' + status, function(done) {
				
				agent
					.post('/orders/status')
					.set('Content-Type', 'application/json')
					.set('X-Requested-With', 'XMLHttpRequest')
					.send({
						order: getOid(),
						status: status
					})
					.expect('Content-type', /json/)
					.expect(200)
					.end(function(err, res) {
						if (err) return done(err) 				
						
						expect(res.body.order.status).to.be.equal(status)
						
						done()
					})
			})
		}

		;[20, 25].forEach(function(status) {
			changeStatusWithError(agent, status, 'user1')
		})
		
		;[10, 15, 25].forEach(function(status) {
			changeStatusWithError(agent2, status, 'user2')
		})
		
		;[5, 10, 15, 20, 25].forEach(function(status) {
			changeStatusWithError(agent3, status, 'user3')
		})
		
		changeStatusWithSuccess(agent, 15, 'user1');
		
		;[10, 20, 25].forEach(function(status) {
			changeStatusWithError(agent, status, 'user1')
		})
		
		;[5, 10, 20, 25].forEach(function(status) {
			changeStatusWithError(agent2, status, 'user2')
		})
		
		changeStatusWithSuccess(agent, 5, 'user1')
		
		changeStatusWithSuccess(agent2, 20, 'user2')
		
		;[5, 10, 15, 25].forEach(function(status) {
			changeStatusWithError(agent, status, 'user1')
		})
		
		;[10, 15, 25].forEach(function(status) {
			changeStatusWithError(agent2, status, 'user2')
		})
		
		changeStatusWithSuccess(agent2, 5, 'user2')
		
		changeStatusWithSuccess(agent, 10, 'user1')
		
		;[5, 15, 20, 25].forEach(function(status) {
			changeStatusWithError(agent, status, 'user1')
		})
		
		;[5, 15, 20, 25].forEach(function(status) {
			changeStatusWithError(agent2, status, 'user2')
		})
		
		it('should return 401 on new review', function(done) {
			agent2
				.post('/reviews/add')
				.set('Content-Type', 'application/json')
				.set('X-Requested-With', 'XMLHttpRequest')
				.send({
					order: mock.order._id,
					rating: 3,
					comment: 'sdsdsd'
				})
				.expect('Content-type', /json/)
				.expect(401)
				.end(function(err, res) {
					if (err) return done(err) 				
					
					expect(res.body).to.be.eql({error: 'Unauthorized'})
					
					done()
				})
		})
		
		changeTripOld(mock.trip2, false)		
		changeStatusWithSuccess(agent, 10, 'user1', 2)
		
		changeTripOld(mock.trip2, true)
		changeStatusWithSuccess(agent, 25, 'user1', 2)
		
		
		checkNotifications(agent2, function(obj) {return obj.newMessages[mock.order._id][0]}, function() {return 3})
		checkNotifications(agent2, function(obj) {return obj.newMessages[mock.order2._id][0]}, function() {return 2})

		checkNotifications(agent, function(obj) {return obj.newMessages[mock.order._id][0]}, function() {return 2})
		checkNotifications(agent, function(obj) {return obj.newMessages[mock.order2._id]}, function() {return undefined})
	})
})

describe('Reviews', function() {
	it('should return 200 on new user2 review for order2', function(done) {
		agent2
			.post('/reviews/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order2._id,
				rating: 3,
				comment: 'Not bad'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
				
				expect(res.body.review.isUserTripper).to.be.false
				expect(res.body.review.order).to.be.equal(mock.order2._id)
				expect(res.body.review.user).to.be.equal(mock.user2.id)
				expect(res.body.review.corr).to.be.equal(mock.user.id)
				
				done()
			})
	})
	
	checkNotifications(agent, function(obj) {return obj.newMessages[mock.order2._id][0]}, function() {return 1})
	
	var reviewId
	
	it('should return 200 on new user1 review for order2', function(done) {
		agent
			.post('/reviews/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order2._id,
				rating: 5,
				comment: 'Excellent'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
					
				reviewId = res.body.review._id
			
				expect(res.body.review.isUserTripper).to.be.true
				expect(res.body.review.order).to.be.equal(mock.order2._id)
				expect(res.body.review.user).to.be.equal(mock.user.id)
				expect(res.body.review.corr).to.be.equal(mock.user2.id)
				
				done()
			})
	})
	
	checkNotifications(agent2, function(obj) {return obj.newMessages[mock.order2._id][0]}, function() {return 3})
	
	it('should not create new review just update', function(done) {
		agent
			.post('/reviews/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order2._id,
				rating: 4,
				comment: 'Excellent'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.review._id).to.be.equal(reviewId)
				
				done()
			})
	})

	it('should get review by orderid', function(done) {
		agent
			.get('/reviews/order/' + mock.order2._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.review._id).to.be.equal(reviewId)
				
				done() 
			}) 
	})

	it('should get reviews for user1', function(done) {
		agent
			.get('/reviews')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.reviews.length).to.be.equal(2)
				expect(res.body.reviews[0].user).to.not.have.property('email')
				expect(res.body.reviews[0].corr).to.not.have.property('email')
				
				expect(res.body.reviews[0].user._id).to.be.equal(mock.user.id)
				expect(res.body.reviews[0].corr._id).to.be.equal(mock.user2.id)
				
				done() 
			}) 
	})
}) 

describe('Invoices', function() {
	// this.timeout(5000);
	
	it('should return fees', function(done) {
		expect( payments.getFees(100, 'USD') ).to.be.eql({
			safe: '100.00',
			oslikiFee: '5.50',
			total: '110.09',
			paypalFee: '4.59',
			nonRefundable: '0.83',
			refundable: '109.26',
			nonRefundableOsliki: '0.50',
			nonRefundablePaypal: '0.33'
		})
		
		expect( payments.getFees(1000, 'CAD') ).to.be.eql({
			safe: '1000.00',
			oslikiFee: '50.50',
			total: '1093.44',
			paypalFee: '42.94',
			nonRefundable: '0.83',
			refundable: '1092.61',
			nonRefundableOsliki: '0.50',
			nonRefundablePaypal: '0.33'
		})
		
		expect( payments.getFees(0.001, 'EUR') ).to.be.false
		expect( payments.getFees(0, 'USD') ).to.be.false
		expect( payments.getFees(undefined, 'USD') ).to.be.false
		expect( payments.getFees(100, 'TUG') ).to.be.false
		expect( payments.getFees() ).to.be.false
		
		expect( payments.getFees(37, 'RUB') ).to.be.eql({
			safe: '37.00',
			oslikiFee: '11.85',
			total: '61.24',
			paypalFee: '12.39',
			nonRefundable: '20.78',
			refundable: '40.46',
			nonRefundableOsliki: '10.00',
			nonRefundablePaypal: '10.78'
		})
		
// console.dir(payments.getFees(100, 'USD'))
// console.dir(payments.getFees(1000, 'CAD'))
// console.dir(payments.getFees(0.001, 'EUR'))
// console.dir(payments.getFees(0, 'USD'))
// console.dir(payments.getFees(undefined, 'USD'))
// console.dir(payments.getFees(100, 'TUG'))
// console.dir( payments.getFees() )
// console.dir(payments.getFees(37, 'RUB'))

		done();
	})
	
	it('should get empty invoices for user1', function(done) {
		agent
			.get('/invoices/order/' + mock.order._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.invoices.length).to.be.equal(0)
				
				done() 
			}) 
	})
	
	it('should not create new invoice for order1 by user2', function(done) {
		agent2
			.post('/invoices/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order._id,
				amount: 100,
				currency: 'USD',
				dest_id: mock.user2.email
			})
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {
	
				if (err) return done(err)	
				done()
			})
	})
	
	it('should create new invoice for order1 by user1', function(done) {
		agent
			.post('/invoices/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order._id,
				amount: 100,
				currency: 'USD',
				dest_id: mock.user.email
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {			
				if (err) return done(err)
					
				expect(res.body.invoice.status).to.be.equal(Invoice.sts.UNPAID)
				expect(res.body.invoice.order).to.be.equal(mock.order._id)
				expect(res.body.invoice.user).to.be.equal(mock.user.id)
				expect(res.body.invoice.corr).to.be.equal(mock.user2.id)	
				expect(res.body.invoice).to.have.property('fees')
				
				done()
			})
	})
	
	checkNotifications(agent2, function(obj) {return obj.newMessages[mock.order._id][0]}, function() {return 4})
	
	var invoiceId 

	it('should get invoices for user1', function(done) {
		agent
			.get('/invoices/order/' + mock.order._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				invoiceId = res.body.invoices[0]._id
				
				expect(res.body.invoices.length).to.be.equal(1)
				expect(res.body.invoices[0].dest_id).to.be.equal(mock.user.email)
				done() 
			}) 
	})

	it('should get invoices for user2', function(done) {
		agent2
			.get('/invoices/order/' + mock.order._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.invoices.length).to.be.equal(1)
				expect(res.body.invoices[0]).to.not.have.property('dest_id')
				
				done() 
			}) 
	})
	
	it('should return 401 for user3', function(done) {
		agent3
			.get('/invoices/order/' + mock.order._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err)
				
				done() 
			}) 
	})
	

	var return_url
	var cancel_url
	
	it('should get a link for pay the invoice by user2', function(done) {
		agent2
			.post('/invoices/pay')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				invoiceId: invoiceId
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {			
				if (err) return done(err)

				var payment = paypalCreateSpy.args[paypalCreateSpy.args.length - 1][0]
				return_url = payment.redirect_urls.return_url.replace(config.host, '/')				
				cancel_url = payment.redirect_urls.cancel_url.replace(config.host, '/')
				
				// payment.transactions = paypalExecuteRes.transactions
				// paypalExecuteRes = payment
				
				expect(res.body).to.have.property('redirectUrl')
				
				done()
			})
	})
	
	it('should execute payment with status PAID', function(done) {	
		agent2
			.get(return_url)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Location', config.host + "messages/order/" + mock.order._id)
			.expect(302)
			.end(function(err, res) {
	
				if (err) return done(err)
				
				Invoice.findById(invoiceId).select('+payment').exec(function(err, invoice) {
					if (err) return done(err)

					expect(invoice.status).to.be.equal(Invoice.sts.PAID)
					
					done()
				})
			}) 
	})
	
	checkNotifications(agent, function(obj) {return obj.newMessages[mock.order._id][0]}, function() {return 3})
	
	it('should return 500 cos undefined payment.id', function(done) {
		agent
			.get('/invoices/check/' + invoiceId)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(500)
			.end(function(err, res) {
				if (err) return done(err)
				
				done() 
			}) 
	})
	
	it('should get html msg about cancelation of payment', function(done) {
		agent
			.get(cancel_url)
			.expect('Content-type', /html/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
				
				done() 
			}) 
	})
	
	it('should return 401 for user1', function(done) {
		agent
			.post('/invoices/unhold')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				invoiceId: invoiceId
			})
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {			
				if (err) return done(err)
				
				done()
			})
	})
	
	it('should return send email to admin', function(done) {
		agent2
			.post('/invoices/unhold')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				invoiceId: invoiceId
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {			
				if (err) return done(err)

				expect( getLastEmail().match(/#([a-z0-9]+)\)/i)[1] ).to.be.equal(invoiceId)
			
				done()
			})
	})
	
	checkNotifications(agent, function(obj) {return obj.newMessages[mock.order._id][0]}, function() {return 4})
	
	it('should return 401 for user2 cos status PENDING', function(done) {
		agent2
			.post('/invoices/refund')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				invoiceId: invoiceId
			})
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {			
				if (err) return done(err)
			
				done()
			})
	})
})

describe('Messages', function() {
	var lastId
	var lastId2
	var lastPrivId
	
	it('should create a new msg by user1', function(done) {
		agent
			.post('/messages/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order._id,
				message: 'hi'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
					
				lastId = res.body.message._id
				
				expect(res.body.message.user).to.be.equal(mock.user.id)
				expect(res.body.message.corr).to.be.equal(mock.user2.id)
				
				done()				
			}) 
	})
	
	checkNotifications(agent2, function(obj) {return obj.newMessages[mock.order._id]}, function() {return [5, lastId]})
	
	it('should create a new msg by user2', function(done) {
		agent2
			.post('/messages/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order._id,
				message: 'hey'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
					
				lastId2 = res.body.message._id
				
				expect(res.body.message.user).to.be.equal(mock.user2.id)
				expect(res.body.message.corr).to.be.equal(mock.user.id)
				
				done() 
			}) 
	})
	
	checkNotifications(agent, function(obj) {return obj.newMessages[mock.order._id]}, function() {return [5, lastId2]})
	
	it('should not create a new msg by user3', function(done) {
		agent3
			.post('/messages/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				order: mock.order._id,
				message: ':D'
			})
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err)
				
				done() 
			}) 
	})

	it('should get msg from user2', function(done) {
		agent
			.get('/messages/last/' + lastId + '/order/' + mock.order._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.messages.length).to.be.equal(1)
				expect(res.body.messages[0]._id).to.be.equal(lastId2)
				expect(res.body.messages[0].user).to.not.have.property('email')
				expect(res.body.order._id).to.be.equal(mock.order._id)
				
				done() 
			}) 
	})
	
	checkNotifications(agent, function(obj) {return obj.newMessages[mock.order._id][0]}, function() {return 0})
	
	it('should not get msg from user2', function(done) {
		agent3
			.get('/messages/last/' + lastId + '/order/' + mock.order._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(401)
			.end(function(err, res) {
				if (err) return done(err)
				
				done() 
			}) 
	})

	it('should not create a new private msg by user1 to user1', function(done) {
		agent
			.post('/messages/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				corr: mock.user.id,
				message: 'hi private'
			})
			.expect('Content-type', /json/)
			.expect(400)
			.end(function(err, res) {
				if (err) return done(err)
				
				done() 
			}) 
	})
	
	it('should create a new private msg by user2 to user1', function(done) {
		agent2
			.post('/messages/add')
			.set('Content-Type', 'application/json')
			.set('X-Requested-With', 'XMLHttpRequest')
			.send({
				corr: mock.user.id,
				message: 'hi private'
			})
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)
				
				lastPrivId = res.body.message._id
				
				expect(res.body.message.user).to.be.equal(mock.user2.id)
				expect(res.body.message.corr).to.be.equal(mock.user.id)
				expect(res.body.message.message).to.be.equal('hi private')
				
				done() 
			}) 
	})
	
	it('should get priv msg', function(done) {
		agent
			.get('/messages/last/0/user/' + mock.user2._id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.messages.length).to.be.equal(1)
				expect(res.body.messages[0]._id).to.be.equal(lastPrivId)
				expect(res.body.messages[0].user).to.not.have.property('email')
				expect(res.body.user._id).to.be.equal(mock.user2.id)
				expect(res.body.user).to.not.have.property('email')
				
				done() 
			}) 
	})
	
	it('should get list of dialogs for user1', function(done) {
		agent
			.get('/messages')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.dialogs.length).to.be.equal(1)
				
				expect(res.body.dialogs[0].lastMsg._id).to.be.equal(lastPrivId)
				
				expect(res.body.dialogs[0].corr._id).to.be.equal(mock.user2.id)
				
				done() 
			}) 
	})
	
	it('should get list of dialogs for user2', function(done) {
		agent2
			.get('/messages')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err) 					

				expect(res.body.dialogs.length).to.be.equal(1)
				
				expect(res.body.dialogs[0].lastMsg._id).to.be.equal(lastPrivId)
				
				expect(res.body.dialogs[0].corr._id).to.be.equal(mock.user.id)
				
				done() 
			}) 
	})

})

describe('Trips search', function() {
	it('should get not empty array of trips with length 1 cos second trip is old', function(done) {
		agent
			.get('/trips?from_id=' + mock.trip.from_id)
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.trips.length).to.be.equal(1)
				expect(res.body.subscribe).to.not.be.null
				
				done() 
			}) 
	})
})

describe('User stats', function() {
	it('should get user1 stats', function(done) {
		agent
			.get('/users/my')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.user.stats).to.eql({
					r_rate: [ 0, 0, 0, 0, 0 ],
					r_proc: 0,
					r_cnt: 0,
					t_rate: [ 0, 0, 1, 0, 0 ],
					t_proc: 1,
					t_order: 2,
					t_cnt: 2
				})
				
				done() 
			}) 
	})
	
	it('should get user2 stats', function(done) {
		agent2
			.get('/users/my')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.user.stats).to.eql({
					r_rate: [ 0, 0, 0, 1, 0 ],
					r_proc: 1,
					r_cnt: 2,
					t_rate: [ 0, 0, 0, 0, 0 ],
					t_proc: 0,
					t_order: 0,
					t_cnt: 0
				})
				
				done() 
			}) 
	})
	
	it('should get  user4 stats', function(done) {
		agent4
			.get('/users/my')
			.set('X-Requested-With', 'XMLHttpRequest')
			.expect('Content-type', /json/)
			.expect(200)
			.end(function(err, res) {
				if (err) return done(err)

				expect(res.body.user.stats).to.eql({
					r_rate: [ 0, 0, 0, 0, 0 ],
					r_proc: 0,
					r_cnt: 0,
					t_rate: [ 0, 0, 0, 0, 0 ],
					t_proc: 0,
					t_order: 0,
					t_cnt: 0
				})
				
				done() 
			}) 
	})
})


after(function() {
	clearDbTbls() 
}) 



