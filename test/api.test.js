var should = require('should'),
    core = require("../lib/core"),
    api   = core.api,
    config   = core.config,
    db   = core.db,
    mongoose = core.db.mongoose;

var Cookies = function(){};
Cookies.prototype.set = function(key, val){
  this[key] = val;
};
Cookies.prototype.get = function(key){
  return this[key];
}
var cookies = new Cookies();

describe("Tests:", function(){
  before(function(){
    // connect to db
    mongoose.connect(config.mongo.url2);
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
    var phoneNumber="+18645251514", messageIn = "hi";
    describe("SMSRegister:", function(){
        var loginError, loginMessage;
        before(function(done){
          api.users.login(cookies, phoneNumber, messageIn, function(error, textMessage){
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
        it("should return Welcome", function(){
          should.exist(loginMessage.match(/elcome/));
        });
        describe("SMSGetLink:", function(){
          var loginError2, loginMessage2;
          var messageIn2 = "link"
          before(function(done){
            api.users.login(cookies, phoneNumber, messageIn2, function(error, textMessage){
              loginError2 = error;
              loginMessage2 = textMessage;
              done();
            });
          });
          it("should NOT return an error", function(){
            should.not.exist(loginError);
          });
          it("should return a text message", function(){
            console.log(loginMessage2);
            should.exist(loginMessage2);
          });
          it("should NOT return Welcome", function(){
            should.not.exist(loginMessage2.match(/elcome/));
          });
          it("should return link", function(){
            should.exist(loginMessage2.match(/http/));
          })
        });//login

        describe("SMSLog:", function(){
          var loginError2, loginMessage2;
          var messageIn2 = "orange"
          before(function(done){
            api.users.login(cookies, phoneNumber, messageIn2, function(error, textMessage){
              loginError2 = error;
              loginMessage2 = textMessage;
              done();
            });
          });
          it("should NOT return an error", function(){
            should.not.exist(loginError2);
            if (loginError2) console.log(loginError2);
          });
          it("should return a text message", function(){
            console.log(loginMessage2);
            should.exist(loginMessage2);
          });
          it("should NOT return Welcome", function(){
            should.not.exist(loginMessage2.match(/elcome/));
          });
          it("should return we logged", function(){
            should.exist(loginMessage2.match(/log/));
          });
        });//login

        // describe("SMSGetRecommendations:", function(){
        //   var loginError2, loginMessage2;
        //   var messageIn2 = "recommend"
        //   before(function(done){
        //     api.users.login(cookies, phoneNumber, messageIn2, function(error, textMessage){
        //       loginError2 = error;
        //       loginMessage2 = textMessage;
        //       done();
        //     });
        //   });
        //   it("should NOT return an error", function(){
        //     should.not.exist(loginError);
        //   });
        //   it("should return a text message", function(){
        //     console.log(loginMessage2);
        //     should.exist(loginMessage2);
        //   });
        //   it("should NOT return Welcome", function(){
        //     should.not.exist(loginMessage2.match(/elcome/));
        //   });
        //   it("should return list", function(){
        //     should.exist(loginMessage2.match(/\(/));
        //   })
        // });//login

        describe("getRecent:", function(){
          var recentError, recentStuff;
          var messageIn2 = "banana";
          before(function(done){
            api.users.login(cookies, phoneNumber, messageIn2, function(error, textMessage){
              recentError = error;
              messageIn2 = "mango";
              api.users.login(cookies, phoneNumber, messageIn2, function(error, textMessage){
                loginError2 = error;
                loginMessage2 = textMessage;

                var userId = cookies.get('userId');
                api.food.getRecent(userId, function(error, recentEats){

                });
                done();
              });
            });
          });
          it("should NOT return an error", function(){
            should.not.exist(loginError2);
            if (loginError2) console.log(loginError2);
          });
        });//login


    });//smsRegister
  });
});