var db = require('./db'),
		config = require('./config'),
		crypto = require('crypto'),
		sys = require('sys'),
		TwilioClient = require('twilio').Client,
		mongoose = require('mongoose'),
		client = new TwilioClient(config.twilio.account_sid, config.twilio.auth_token, config.twilio.host_name),
		phone = client.getPhoneNumber(config.twilio.phone_number);

var request = require('request');


var food = (function(){

	var API_KEY = config.carepass.fooducate_key;
	var BASE_URL = config.carepass.base_url;

	var SEARCH_ENDPOINT = '/products/search';
	var GET_ENDPOINT = '/product';

	var Food = function(){};

	var translateFood = function(food)
	{
		var foodObj = {};
		
		foodObj.name = food.brand + " " + food.name;
		foodObj.image = food.image || '';
		foodObj.id = food.id;
		foodObj.url = food.webUrl;

		if(food.fooducateServing && food.fooducateServing.text && food.fooducateServing.text != 'null')
			foodObj.serving = food.fooducateServing.text;
		else
			foodObj.serving = '1';

		if(food.fooducateServing && food.fooducateServing.calories)
			foodObj.calories = food.fooducateServing.calories;
		else
			foodObj.calories = '';

		if(food.fooducateGrade && food.fooducateGrade.score)
			foodObj.score = food.fooducateGrade.score;
		else
			foodObj.score = '5';

		return foodObj;
	};

	Food.prototype.find = function(foodName, callback){

		if(!foodName || !foodName.trim().length)
		{
			callback([]);
			return;
		}

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
					retArray.push(translateFood(body[i]));

				callback(retArray);
			}
			else
			{
				callback([]);
			}
		});
	};

	Food.prototype.getById = function(foodId, callback)
	{

		if(!foodId || !foodId.trim().length)
		{
			callback({});
			return;
		}

		request({
			'uri' :BASE_URL + GET_ENDPOINT,
			'method' : 'get',
			'qs' : {
				'apikey' : API_KEY,
				'reason' : 'search',
				'productid' : foodId,
				'comments' : false
			},
			'json' : true
		},
		function(error, response, body)
		{
			if(!error && response.statusCode == 200)
				callback(translateFood(body));
			else
				callback({});
		});
	};

	//food

	Food.prototype.getRecommendations = function(phoneNumberOrUserId, callback) {
		//get remember the milk entries
		//get recipes?
		var data;
		if (phoneNumberOrUserId instanceof db.ObjectId) {
			data = {
				by: phoneNumberOrUserId
			};
		}
		else if (phoneNumberOrUserId.length > 9) {
			data = {
				by: new ObjectId(phoneNumberOrUserId)
			};
		}


		var recommendations = [
			{name:"food", score:50},
			{name:"food", score:50},
			{name:"food", score:50},
			{name:"food", score:50}
		];
		callback(null, recommendations);
	};

	Food.prototype.getRecommendationsText = function(phoneNumber, callback) {
		var textMessage = "";
		api.food.getRecommendations(phoneNumber, function(error, recommendations){
			if (error) {
				callback(error);
				return;
			}
			var i, len = recommendations.length, rec;
			for (i=0; i<len; i++) {
				rec = recommendations[i];
				textMessage += rec.name + " ("+rec.points+") " + "\n";
			}
			callback(null, textMessage);
		});
	};

	Food.prototype.log = function(phoneNumberOrUserId, name, callback) {
		//try and match name to something we know and find points
		// remember the milk update?
		var data;
		if (phoneNumberOrUserId instanceof db.ObjectId) {
			//objectID
			data = {
				by: phoneNumberOrUserId
			};
			ate.create(data, callback);
		}
		else if (phoneNumberOrUserId.length > 9) {
			//ObjectId String
			data = {
				by: new ObjectId(phoneNumberOrUserId)
			};
			ate.create(data, callback);
		}
		else {
			// phone number
			api.users.findOneByPhoneNumber(phoneNumber, function(error, user){
				if (error) {
					callback(error);
					return;
				}
				data = {
					by: user._id
				};
				ate.create(data, callback);
			});
		}
	};

	Food.prototype.logByPhone = function(phoneNumber, name, callback) {
		api.food.log(phoneNumber, name, function(error, ateCreated) {
			if (error) {
				callback(error);
				return;
			}
			var textMessage = "Thanks we logged "+ateCreated.name;
			callback(null, textMessage);
		});
	};

	return new Food();
})();

var ate = (function(){
	var Ate = function(){};

	Ate.prototype.create = function(phoneNumber, name, callback) {
		//create new list of what you ate
		var ateData = {
			by: phoneNumber,
			what: name
		};
		var ateModel = new db.AteModel(ateData, callback);
	};

	return new Ate();
})();

var users = (function(){
	var Users = function(){};

	Users.prototype.login = function(cookies, phoneNumber, recievedMessage, callback){
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
		console.log(query);
		db.users.findAndModify(query, [], update, options, function(error, user) {
			if (error) {
				callback(error);
				return;
			}
			//SET COOKIE!!!!
			var userId = user._id.toString();
			cookies.set('userId', userId);

			var textMessage, userLink;
			if (user.loginCount === 1) {
				// brand new user
				userLink = config.rootURL + userJSON._id.toString();
				textMessage = "Hello! Welcome to 'I Just Ate' text me when you eat something. We'll email you around meal times." + userLink;
				callback(null, textMessage);
			}
			else {
				var matchResults;
				if (recievedMessage.trim().length === 0 || recievedMessage.match(/(link)/)) {
					userLink = config.rootURL + userJSON._id.toString();
					textMessage = "Here ya go: "+userLink;
				}
				else if (recievedMessage.match(/(recommend)|(suggest)/)) {
					//get recommendations
					api.food.getRecommendationsText(userId, callback);
				}
				else {
					//anything else attempt to log as food entry
					api.food.logByPhone(userId, name, callback);
				}
			}
		});
	};

	return new Users();
})();

var remember = (function(){

	var API_KEY = config.remember_the_milk.api_key;
	var SHARED_SECRET = config.remember_the_milk.shared_secret;
	var BASE_URL = config.remember_the_milk.base_url;
	var AUTH_URL = config.remember_the_milk.auth_url;

	var Remember = function(){};
	var generateApiSig = function(params)
	{
		
		var keysSorted = Object.keys(params).sort();
		var api_sig = SHARED_SECRET;
		for(var i = 0; i < keysSorted.length; i++){
			api_sig += keysSorted[i] + params[keysSorted[i]];
		}
		
		return crypto.createHash('md5').update(api_sig).digest("hex");
	};

	var serialize = function(obj) {
		var str = [];
		for(var p in obj)
			str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
		return str.join("&");
	};

	Remember.prototype.generateAuthLink = function(){
		var queryStringObj = {};
		queryStringObj.api_key = API_KEY;
		queryStringObj.perms = 'read';
		queryStringObj.format = 'json';
		queryStringObj.api_sig = generateApiSig(queryStringObj);

		return AUTH_URL + "?" + serialize(queryStringObj);

	};

	Remember.prototype.getAndStoreToken = function(userId, frob, callback)	{
		
		if(!userId || !userId.trim().length || !frob || !frob.trim().length)
		{
			callback({});
			return;
		}
		var queryParamObject = {
				'api_key': API_KEY,
				'method' : 'rtm.auth.getToken',
				'frob' : frob,
				'format': 'json'
		};
		queryParamObject.api_sig = generateApiSig(queryParamObject);

		request({
			'uri' : BASE_URL,
			'method' : 'get',
			'qs' : queryParamObject,
			'json' : true
		},
		function(error, response, body)
		{

			if(!error && response.statusCode == 200){
				console.log(body);
				db.users.update({'_id': mongoose.Types.ObjectId(userId)}, {$set:{milkToken: body.rsp.auth.token}}, {safe: true}, function(error) {
					if (error) {
						callback(error);
						return;
					}
				});
				callback(null, true);
			}else
				callback(null, false);
		});
	};
	
	return new Remember();
})();

var api = module.exports = {
	users: users,
	food: food,
	remember: remember
};
