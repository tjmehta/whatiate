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

  app.get('/api/food/find/:name', function(req, res){
    api.food.find(req.param('name'), res.pond);
  });

  app.get('/api/food/getById/:id', function(req, res){
    api.food.getById(req.param('id'), res.pond);
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
    var userId = req.params.userId;
    var name   = req.body.name;
    api.food.log(userId, name, res.pond);
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

