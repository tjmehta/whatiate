var core = require('../lib/core/index'),
    api = core.api,
    config = core.config,
    twilio = require('twilio').Twiml;

var router = module.exports = function(app){
  //REST - prepend all urls with /api
  // post-Create
  // get -Read
  // put -Update
  // del -Delete

  //Twilio TwiML
  app.get('/test', function(req, res) {
    var twimlOptions = {
      message: "test",
      from: config.twilio.phone_number,
      to: "from"
    };
    res.contentType('text/xml');
    res.render('twiml.html', twimlOptions);
  });
  app.post('/api/sms', function(req, res){
    //recieved sms
    var smsFrom = req.body.From;
    var recievedMessage = req.body.Body;


    api.users.login(req.cookies, smsFrom, recievedMessage, function(error, textMessage){
      var twimlOptions = {
        message: textMessage,
        from: config.twilio.phone_number,
        to: smsFrom
      };
      res.render('twiml.html', twimlOptions);
    });
  });

  app.get('/', function(req,res) {
    res.pond('hello world');
  });

  app.get('/api', function(req, res){
    res.send('hello');
  });

  app.get('/api/login/:phoneNumber', function(req, res){
    var phoneNumber = "+1"+req.param('phoneNumber');
    api.users.login(req.cookies, phoneNumber, "", function(error, textMessage){
      res.pond(textMessage);
    });
  });

  app.get('/api/food/find/:name', function(req, res){
    api.food.find(req.param('name'), res.pond);
  });

  app.get('/api/food/find', function(req, res){
    api.food.find(req.param('term'), res.pond);
  });

  app.get('/api/food/getById/:id', function(req, res){
    api.food.getById(req.param('id'), res.pond);
  });

  app.get('/home/:id', function(req, res){
    api.food.getRecent(req.param('id'), function(err, list)
    {
	var score = 0;
	if(list && list.length)
	{
		for(var i=0; i<list.length; i++)
			score += list[i].score;
		score /= list.length;
	}
	else
	{
		score = 5
    	}
	res.render('home.html', { layout: 'mobile.html', locals: { userId: req.param('id'), weekScore : score} });
    });
  });

  app.get('/times/:id', function(req, res){
    res.render('times.html', { layout: 'mobile.html', locals: { userId: req.param('id')} });
  });

  app.get('/logfood/:id', function(req, res){
    res.render('logfood.html', { layout: 'mobile.html', locals: { userId: req.param('id') } });
  });

  app.get('/recent/:id', function(req, res){
    api.food.getRecent(req.param('id'), function(err, list)
    {
	if(!list)
	    list = [];
    	res.render('recent.html', { layout: 'mobile.html', locals: { userId: req.cookies.get('userId') , recent : list} });
    });
  });

  app.get('/rememberthemilk', function(req, res){
    api.remember.getAndStoreToken(req.cookies.get('userId'), req.query["frob"], function(error, success){
	//'5071bb7564c82f0008000001', req.query["frob"], function(error, success){
      //res.redirect("/suggest/5071bb7564c82f0008000001");
      res.redirect("/suggest/"+req.cookies.get('userId'));
    });
  });

  app.get('/milk/link', function(req, res){
    console.log(api.remember.generateAuthLink());
  });

  app.get('/milk/list/food', function(req, res){
    api.remember.getFoodList('d2b7d7ebe54deff9d52c958f8e53c4ed116888df', function(error, data){
      res.send(data);
    });
  });

  app.get('/details/:user/:food', function(req, res){
    api.food.getById(req.param('food'), function(food)
    {
    	res.render('details.html', { layout: 'mobile.html', locals: { userId: req.param('user'), food: food } });
    });
  });

  app.get('/suggest/:user', function(req, res){
	if(req.cookies.get('milkToken'))
	{
		api.food.getRecommendations(req.param('user'), function(error, list)
		{
			var topItem = {};
			if(list && list.length)
				topItem = list[0];
			res.render('suggest.html', { layout: 'mobile.html', locals: { userId: req.param('user'), food: topItem } });
		});
	}
	else
	{
		res.redirect(api.remember.generateAuthLink());
		//res.send("<html><script>document.location='"+api.remember.generateAuthLink()+"';</script>");
	}
  });

  app.get('/api/:userId/food/recommendations', function(req, res){
    var userId = req.params.userId;
    api.food.getRecommendations(userId, res.pond);
  });
  // var recommendations = [
  //     {name:"food", score:50},
  //     {name:"food", score:50},
  //     {name:"food", score:50},
  //     {name:"food", score:50}
  //   ];

  app.post('/api/:userId/food/log', function(req, res){
    var userId = req.param('userId');
    var foodId   = req.body.food;
    api.food.logById(userId, foodId, res.pond);
  });
  //returns the name and score just like a recommendation object

  app.get('/api/:userId/food/past', function(req, res){

  });
  // //past ate's look like
  // {
  //   what:
  //   when:Date
  //   name:
  //   score:
  // }
};

