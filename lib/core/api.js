var db = require('./db'),
		config = require('./config'),
		sys = require('sys'),
		TwilioClient = require('twilio').Client,
		client = new TwilioClient(config.twilio.account_sid, config.twilio.auth_token, config.twilio.host_name),
		phone = client.getPhoneNumber(config.twilio.phone_number);

var request = require('request');

var Food = (function(){

	var API_KEY = 'tp35es6bbwr65r2pu4c8yub3';
	var BASE_URL = 'https://api.carepass.com/fooducate-api';

	var SEARCH_ENDPOINT = '/products/search';

	var Food = function(){};
	
	Food.prototype.find = function(foodName, callback){

		if(!foodName || !foodName.trim().length)
			callback([]);
		request({
			'uri' :BASE_URL + SEARCH_ENDPOINT, 
			'method' : 'get',
			'qs' : {
				'apikey' : API_KEY,
				'searchterm' : foodName,
				'autocorrect' : true,
				'count' : 15,
				'offset' : 0
			},
			'json' : true
		},
		function(error, response, body)
		{
			if(!error && response.statusCode == 200)
			{
				var retArray = [];
				for(var i=0; i<body.length; i++)
				{
					var food = body[i];
					var foodObj = {};
					
					foodObj.name = food.brand + food.name;
					foodObj.image = food.image || '';
					
					if(food.fooducateServing && food.fooducateServing.text)
						foodObj.serving = food.fooducateServing.text;
					else
						foodObj.serving = '';

					if(food.fooducateServing && food.fooducateServing.calories)
						foodObj.calories = food.fooducateServing.calories;
					else
						foodObj.calories = '';

					if(food.fooducateGrade && food.fooducateGrade.score)
						foodObj.score = food.fooducateGrade.score;
					else
						foodObj.score = 5;

					retArray.push(foodObj);
				}

				callback(retArray);
			}
			callback([]);
		})
	};

});

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
