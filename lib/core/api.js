var db = require('./db'),
    config = require('./config');

var Users = (function(){
  var Users = function(){};

  Users.prototype.login = function(phoneNumber, callback){
    // var query = {
    //       phoneNumber: phoneNumber
    //     }
    // db.users.findAndModify()

  };

  return new Users();
})();



var api = module.exports = {
  users: Users
};