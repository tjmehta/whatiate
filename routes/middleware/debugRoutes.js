var core = require("../../lib/core");
var helpers = core.helpers;

var debugRoutes = module.exports = {
  express: function(req, res, next){
    if (!helpers.isEmpty(req.query))
      console.log("query",req.query);
    if (!helpers.isEmpty(req.body))
      console.log("body ",req.body);
    next();
  }
};