var core = require('../lib/core/index'),
    api = core.api;

var router = module.exports = function(app){
  //REST - prepend all urls with /api
  // post-Create
  // get -Read
  // put -Update
  // del -Delete

  app.get('/', function(req,res) {
    res.pond('hello world');
  });

  app.post('/api/users', function(req, res) {
    // api.users.login()
  });

};

// Twilio routes
api.phone.setup(function() {
  // But wait! What if our number receives an incoming SMS?
  api.phone.on('incomingSms', function(req, res) {

      // As above, req contains the Twilio request parameters.
      // Res is a Twiml.Response object.
      console.log('Received incoming SMS with text: ' + req.Body);
      console.log('From: ' + req.From);

      api.users.login(req.From, function(error, userLink){

      });
  });
});

