var should = require('should'),
    core = require("../lib/core"),
    api   = core.api,
    config   = core.config,
    db   = core.db,
    mongoose = core.db.mongoose;


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
    after(function(done){
      //cleanup. delete all users in test db
      db.users.findAndModify({}, [], {}, {remove:true}, function(error, user){
        if (error) throw error;
        //removed all users.
        done();
      });
    });
    var phoneNumber="8645251514"
    describe("SMSLogin:", function(){
        var loginError, loginMessage;
        before(function(done){
          api.users.login(phoneNumber, function(error, textMessage){
            loginError = error;
            loginMessage = textMessage;
            done();
          });
        });
        it("should NOT return an error", function(){
          should.not.exist(loginError);
        });
        it("should return a text message", function(){
          console.log(loginMessage);
          should.exist(loginMessage);
        });

    });
  });
});