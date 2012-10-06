var db = require('./db'),
		config = require('./config'),
		sys = require('sys'),
		TwilioClient = require('twilio').Client,
		client = new TwilioClient(config.twilio.account_sid, config.twilio.auth_token, config.twilio.host_name),
		phone = client.getPhoneNumber(config.twilio.phone_number);


var users = (function(){
  var Users = function(){};

  Users.prototype.login = function(phoneNumber, callback){
    var query = {
          phoneNumber: phoneNumber
        },
        update = {
          $inc: {
            loginCount: 1
          }
        },
        options = {
          upsert: true
        };
    db.users.findAndModify(query, [], update, options, function(error, user) {
      if (error) {
        callback(error);
        return;
      }
      var userJSON = user.toJSON();
      var userURL = config.api.rootURL + userJSON._id;
      if (userJSON.loginCount === 1) {
        // new user registration
        callback(null, userURL + '/new');
      }
      else {
        // user login
        callback(null, userURL);
      }
    });
  };

  return new Users();
})();

var api = module.exports = {
  users: users,
	phone: phone
};
