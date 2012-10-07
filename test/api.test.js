var should = require('should'),
    core = require("../lib/core"),
    db   = core.db;


describe("Tests:", function(){
  before(function(){
    // connect to db
    mongoose.connect(config.mongo.testUrl);
  });
  after(function(){
    mongoose.disconnect();
  });
  describe("Users:", function(){
    before(function(done){
      //cleanup. delete all users in test db
      db.users.findAndModify({}, [], {}, {remove:true}, function(error, user){
        if (error) throw error;
        //removed all users.
        done();
      });
    });
    var phoneNumber="8645251514"
    describe("Login:", function(){
      api.users.login(phoneNumber, function(error, userURL){


      });
    });

  });

});