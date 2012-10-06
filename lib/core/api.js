var Users = (function(){
  var Users = function(){};

  Users.prototype.login = function(){

  };
});

var Food = (function(){

	var API_KEY = 'tp35es6bbwr65r2pu4c8yub3';
	var BASE_URL = 'https://api.carepass.com/fooducate-api';

	var SEARCH_ENDPOINT = '/products/search';

	var Food = function(){};
	var request = require('request');
	
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
