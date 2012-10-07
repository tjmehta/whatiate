var Path = require("path");
var fs = require("fs");

var development = {
  rootURL: "http://nodestep.com/",
  env  : "development",
  port : 3001,
  mongo: {
    url     : "mongodb://tj:tj@alex.mongohq.com:10060/foodquick",
    testUrl : "mongodb://tj:tj@alex.mongohq.com:10065/foodquick_test"
  },
  twilio: {
    account_sid: 'ACff0a4e417e0434b8adaa5d32fd0dfee9',
    auth_token: '45321048bf9da7eef81c869bd504740f',
    phone_number: '+16579991283',
    host_name: 'api.twilio.com'
  },
  remember_the_milk: {
    api_key: '635b1ae46b559e486897014277888949',
    shared_secret: 'c5e71f5620c3acc4'
  },
  carepass: {
    fooducate_key: 'tp35es6bbwr65r2pu4c8yub3'
  }
};
var production = {
  env : "production",
  port: 80
};
var allEnvironments = {
  test: "what"
};

var config = module.exports = (process.env.NODE_ENV == 'production') ? production : development;

var copyValues = function(toObj, fromObj){
  for (var key in fromObj) {
    if (fromObj.hasOwnProperty(key)) {
      if (typeof fromObj[key] == 'object' && !Array.isArray(fromObj[key])){
        toObj[key] = toObj[key] || {};
        copyValues(toObj[key], fromObj[key]);
      }
      else {
        toObj[key] = fromObj[key];
      }
    }
  }
};

copyValues(config, allEnvironments);