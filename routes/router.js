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

