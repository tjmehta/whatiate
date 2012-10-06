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

var api = module.exports = {
	phone: Phone,
	food: Food
};
