var db = require('./db'),
		config = require('./config'),
		crypto = require('crypto'),
		sys = require('sys'),
		TwilioClient = require('twilio').Client,
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
				'count' : 10,
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

	Food.prototype.getRecommendations = function(milkToken , callback) {
    //get remember the milk entries
    api.remember.getFoodList(milkToken, function(error, list){
      var i, len = list.length, itemsPushed = 0;
      var recommendations = [], foodName;
      for (i=0;i<len;i++) {
        foodName = list[i];
        api.food.getFoodByName(foodName, function(error, foodObject){
          recommendations.push(foodObject);
          itemsPushed++;
          if (itemsPushed == len){
            //all items pushed
            recommendations.sort(function(item1, item2){
              return (item1.score > item2.score) ? 1 : 0;
            });
            callback(null, recommendations);
          }
        });
      }
      //get recipes?
    });
	};

	Food.prototype.getRecommendationsText = function(milkToken, callback) {
    api.food.getRecommendations(milkToken, function(error, recommendations){
      if (error) {
        callback(error);
        return;
      }
      var textMessage ="";
			var i, len = recommendations.length, rec;
			for (i=0; i<len; i++) {
        rec = recommendations[i];
        if (i===0) console.log(rec.name);
				textMessage += rec.name + " ("+rec.score+") " + "\n";
			}
			callback(null, textMessage);
		});
	};

  Food.prototype.getFoodByName = function(name, callback){
    api.food.find(name, function(foodList){
      var foodObject = foodList[0];
      callback(null, foodObject);
    });
  };

  Food.prototype.logById = function(userObjectId, foodId, callback) {
    if (typeof userObjectId == 'string')
      userObjectId = new db.ObjectId(userObjectId);

    api.food.getById(foodId, function(foodObject){
      var options = {
        who  : userObjectId,
        name : foodObject.name,
        score: foodObject.score,
        whatId: foodId
      };
      api.food.log(options, callback);
    });
  };

  Food.prototype.logByName = function(userObjectId, foodName, callback) {
    if (typeof userObjectId == 'string')
      userObjectId = new db.ObjectId(userObjectId);
		//try and match name to something we know and find points
    api.food.find(foodName, function(foodList){
      var foodObject = foodList[0];
      var options = {
        who  : userObjectId,
        name : foodObject.name,
        score: foodObject.score,
        whatId: foodObject.id
      };
      api.food.log(options, callback);
    });
  };

  Food.prototype.log = function(options, callback) {
		// remember the milk update?
    var ateQuery = new db.Ate(options);
    ateQuery.save(function(error){
      callback(error, ateQuery.toJSON());
    });
	};

  Food.prototype.getRecent = function(userObjectId, callback) {
    if (typeof userObjectId == 'string')
      userObjectId = new db.ObjectId(userObjectId);

    var query = {
      who: userObjectId
    };
    var ateQuery = db.Ate;
    ateQuery.find(query).sort('when').exec(callback);
  };

	Food.prototype.logByPhone = function(userObjectId, name, callback) {
    console.log('foodName',name);
    api.food.logByName(userObjectId, name, function(error, ateCreated) {
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


/* USERS ------------------- */
/* USERS ------------------- */
/* USERS ------------------- */
/* USERS ------------------- */
/* USERS ------------------- */

var users = (function(){
	var Users = function(){};

  Users.prototype.findOneById = function(userId) {
    if (!(userId instanceof db.ObjectId)) {
      userId = db.ObjectId(id);
    }
    var query = {
      _id : userId
    };
    db.users.findOne(query, callback);
  };

  Users.prototype.findOneByPhoneNumber = function(phoneNumber, callback) {
    var query = {
      phoneNumber: phoneNumber
    };
    db.users.findOne(query, callback);
  };

  Users.prototype.getObjectIdFromPhoneOrUserId = function(phoneNumberOrUserId, callback) {
    var userObjectId;
    if (phoneNumberOrUserId instanceof db.ObjectId) {
      //objectID
      userObjectId = phoneNumberOrUserId;
      callback(null, userObjectId);
    }
    else if (phoneNumberOrUserId.length > 9) {
      //ObjectId String
      userObjectId = new ObjectId(phoneNumberOrUserId);
      callback(null, userObjectId);
    }
    else {
      // phone number
      api.users.findOneByPhoneNumber(phoneNumber, function(error, user){
        userObjectId = user._id;
        callback(null, userObjectId);
      });
    }
  };

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
					upsert: true,
          'new': true
				};
		db.users.findAndModify(query, [], update, options, function(error, user) {
			if (error) {
				callback(error);
				return;
			}
			//SET COOKIE!!!!
			var userIdString = user._id.toString();
      var userObjectId = user._id;
			cookies.set('userId', userIdString);
      console.log("userIdObject", user._id);
      console.log("userIdObjectString", user._id.toString());
      if (user.milkToken) {
        cookies.set('milkToken', user.milkToken);
      }
      // console.log("LOGINCOUNT", user.loginCount, user.loginCount===1);
			var textMessage, userLink;
			if (user.loginCount === 1) {
				// brand new user`
				userLink = config.rootURL + "times/"+ userIdString;
				textMessage = "Hello! Welcome to 'I Just Ate' text me when you eat something. We'll email you around meal times." + userLink;
				callback(null, textMessage);
			}
			else {
				var matchResults;
				if (recievedMessage.trim().length === 0 || recievedMessage.match(/(link)/)) {
					userLink = config.rootURL + 'home/' + userIdString;
					textMessage = "Here ya go: "+userLink;
          callback(null, textMessage);
				}
				else if (recievedMessage.match(/(recommend)|(suggest)/)) {
					//get recommendations
          var milkToken = cookies.get('milkToken');
					api.food.getRecommendationsText(milkToken, callback);
				}
				else {
					//anything else attempt to log as food entry
          var name = recievedMessage.trim();
					api.food.logByPhone(userObjectId, name, callback);
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

	Remember.prototype.getFoodList = function(token, callback){
    if (!token) {
      var list = ['orange','apple','milk'];
      callback(null, list);
      return;
    }

		token = 'd2b7d7ebe54deff9d52c958f8e53c4ed116888df';
		var queryParamObject = {
				'api_key': API_KEY,
				'method' : 'rtm.tasks.getList',
				'auth_token' : token,
				'filter' : "list:Food",
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

			console.log(body.rsp.tasks.list[0].taskseries);
			var foodList = [];
			body.rsp.tasks.list[0].taskseries.forEach(function(food){
					foodList.push(food.name);
			});
			if(!error && response.statusCode == 200){
				callback(true, foodList);
			}else
				callback(false, {'error':error});
		});
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
			console.log(body);
			if(!error && response.statusCode == 200){
				console.log(body);
				db.users.update({'_id': db.ObjectId(userId)}, {$set:{milkToken: body.rsp.auth.token}}, {safe: true}, function(error) {
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
