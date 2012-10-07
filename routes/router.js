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

};

