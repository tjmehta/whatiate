//auth middleware
var Auth = function(req, res, next){
  checkAuth(req, res, function(){
    if (!req.user) {
      var error = new errors.AuthError("Please log in.");
      res.pond(error, 403);
    }
  });
};

var checkAuth = function(req, res, next){
  var authToken = req.cookies.get('token');
  if (authToken) {
    var fieldsToReturn = {
      token: 1,
      email: 1,
      loginCount:1
    };
    api.users.findOneByToken(authToken, fieldsToReturn, function(error, user) {
      if (error) {
        res.pond(error);
        return;
      }

      req.user = user;
      next();
    });
  }
  else {
    req.user = null;
    next();
  }
  // else {
  //   error = new Error("Authentication Error");
  //   res.pond(error);
  // }
};

var noAuth = function(req, res, next){
  var authToken = req.cookies.get('token');
  var error;
  if (authToken) {
    error = new Error("Please log out.");
    res.pond(error);
  }
  else {
    next();
  }
};

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

  });

};

