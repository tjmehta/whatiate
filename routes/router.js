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
    console.log("HELLO");
    console.log(req.body.From);
    var smsFrom = req.body.From;
    api.users.login(smsFrom, function(error, textMessage){
      var twimlOptions = {
        message: textMessage,
        from: config.twilio.phone_number,
        to: smsFrom
      };
      console.log("", twimlOptions, "");
      res.render('twiml.html', twimlOptions);
    });
  });

  app.get('/', function(req,res) {
    res.pond('hello world');
  });

  app.get('/api', function(req, res){
    res.send('hello');
  });

  app.get('/api/food/find/:name', function(req, res){
    api.food.find(req.param('name'), res.pond);
  });

  app.get('/api/food/getById/:id', function(req, res){
    api.food.getById(req.param('id'), res.pond);
  });

  app.get('/home/:id', function(req, res){
    res.render('home.html', { layout: 'mobile.html', locals: { userId: req.param('id') } });
  });

  app.get('/times/:id', function(req, res){
    res.render('times.html', { layout: 'mobile.html', locals: { userId: req.param('id') } });
  });

  app.get('/logfood/:id', function(req, res){
    res.render('logfood.html', { layout: 'mobile.html', locals: { userId: req.param('id') } });
  });

  app.get('/recent/:id', function(req, res){
    res.render('recent.html', { layout: 'mobile.html', locals: { userId: req.param('id') } });
  });

  app.get('/details/:user/:food', function(req, res){
    api.food.getById(req.param('id'), function(food)
    {
	console.log(food);
    	res.render('details.html', { layout: 'mobile.html', locals: { userId: req.param('userid'), food: food } });
    });
  });

};

