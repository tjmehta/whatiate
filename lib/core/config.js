var Path = require("path");
var fs = require("fs");

var development = {
  env  : "development",
  port : 3001,
  mongo: {
    url     : "mongodb://127.0.0.1:1340/whatiate",
    testUrl : "mongodb://127.0.0.1:1340/whatiate_test"
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
