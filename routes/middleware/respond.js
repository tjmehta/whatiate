    // logger = core.loggers.api;
var logger = {};
logger.info = logger.error = console.log;
var createSend = function(req, res){
  var sendJSON = function(json, httpCode){
        res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
        res.contentType('application/json');
        res.send(json, httpCode);
        if (httpCode>400) {
          logger.error(httpCode);
          logger.error(json);
          logger.error(json.extra);
        }
        else {
          logger.info(httpCode);
          logger.info(json);
        }
      },
      sendData  = function(data, httpCode){
        if (data._doc) data = data._doc;
        sendJSON(data, httpCode || 200);
      },
      sendError = function(error, httpCode){
        var json = {error:error};
        sendJSON(json, httpCode || 400);
      };

    return function send(error, data, httpCode, log){
      if (!(error instanceof Error)) {
        // f(data, ...)
        if (typeof data == 'boolean') {
          // f(data, log)
          httpCode = null;
          log  = data;
          data = error;
        }
        else {
          // f(data, httpCode, log)
          log      = httpCode;
          httpCode = data;
          data     = error;
          error = null;
        }
      }
      else {
        // f(error, ...)
        if (typeof data == 'boolean') {
          // f(data, log)
          httpCode = null;
          log  = data;
          data = error;
        }
        else {
          // f(error, httpCode, log)
          log      = httpCode;
          httpCode = data;
          data = null;
        }
      }

      //if (log) {} //TODO..

      if (error) sendError(error, httpCode);
      else sendData(data, httpCode);
    };
};

module.exports.connect = module.exports.express = function(){
  var respond = function(req, res, next){

    res.pond = createSend(req, res);

    res.pondWithKeyPath = function(keyPath){
      var prependDataWithKeyPath = function(data){
            var dataWithKeyPath = {};
            if (keyPath) {
              if (!Array.isArray(data) && keyPath.slice(-1)=='s'){
                // data is not array and keyPath ends with s (ex: users)
                // chop the s off since it is not a list of users.
                keyPath = keyPath.slice(0,-1);
              }
              dataWithKeyPath[keyPath] = data;

              return dataWithKeyPath;
            }
            else {
              return data;
            }
          };

      return function(error, data, log){
        if (error && !(error instanceof Error)) {
          log = data || null;
          data = error;
          error = null;
        }
        data = prependDataWithKeyPath(data);
        res.pond(error, data, log);
      };

    };

    next();
  };

  if (arguments.length) {
    respond.apply(this, arguments);
  }
  else {
    return respond;
  }
};