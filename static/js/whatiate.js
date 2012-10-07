(function WhatIAte(whatiate) {

	whatiate.save = function(url, params)
	{
		$.ajax(url, {
			method : 'get',
			data : params,
			async : false
		});
	};

	whatiate.scoreToText = function(score)
	{
		var num = score;
		if(typeof num == "string")
			num = parseInt(num);
		if(num > 6)
			return "Good!";
		if(num < 4)
			return "Bad";
		return "Alright";
	};

	whatiate.scoreToTheme = function(score)
	{
		var num = score;
		if(typeof num == "string")
			num = parseInt(num);
		if(num > 6)
			return "b";
		if(num < 4)
			return "d";
		return "c";
	};

	whatiate.buildName = function(obj)
	{
		return obj.name + ' - (' + obj.score + ')';
	};

})(window.whatiate = window.whatiate || {})
