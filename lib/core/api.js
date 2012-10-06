var db = require('./db'),
		config = require('./config'),
		sys = require('sys'),
		TwilioClient = require('twilio').Client,
		client = new TwilioClient(config.twilio.account_sid, config.twilio.auth_token, config.twilio.host_name),    
		phone = client.getPhoneNumber(config.twilio.phone_number);


var Phone = (function(){
	var Phone = function(){};

	Phone.prototype.setupPhone = function(callback){    
	phone.setup(function() {
		
			// But wait! What if our number receives an incoming SMS?
			phone.on('incomingSms', function(reqParams, res) {

					// As above, reqParams contains the Twilio request parameters.
					// Res is a Twiml.Response object.

					console.log('Received incoming SMS with text: ' + reqParams.Body);
					console.log('From: ' + reqParams.From);
			});

			// Oh, and what if we get an incoming call?
			phone.on('incomingCall', function(reqParams, res) {

					res.append(new Twiml.Say('Thanks for calling! I think you are beautiful!'));
					res.send();
			});
	});
	};
	return new Phone();
})();

var Users = (function(){
  var Users = function(){};

  Users.prototype.login = function(phoneNumber, callback){
    // var query = {
    //       phoneNumber: phoneNumber
    //     }
    // db.users.findAndModify()

  };

  return new Users();
})();




var api = module.exports = {
	phone: Phone
};
