var express    = require('express'),
    cookies    = require('cookies'),
    cluster    = require('cluster'),
    core       = require('./lib/core'),
    config     = core.config,
    routes     = require('./routes'),
    middleware = routes.middleware,
    mongoose   = core.db.mongoose,
    hbs        = require('hbs'),
    app        = module.exports = express.createServer();

/*
** CONFIG DATABASE
*/
mongoose.connect(config.mongo.url2);

/*
** CONFIG SERVER
*/
var expressLogger = {
  write: function(buffer){
    console.log(buffer.trim());
  }
};
app.configure(function(){
  app.use(express.logger({stream: expressLogger,  format: ':method :url'}));
  app.use(express.bodyParser());
  app.use(cookies.express());
  app.use(express.methodOverride());
  if (config.env == 'development')
    app.use(middleware.debugRoutes.express);
  app.use(middleware.respond.express());
  app.register('html', hbs);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'html');
  app.use(express.static(__dirname + "/static"));
});

process.on('uncaughtException', function(err) {
    console.log( " UNCAUGHT EXCEPTION " );
    console.log( "[Inside 'uncaughtException' event] " + err.stack || err.message );
});

/*
** ROUTES
*/
routes.router(app);

/*
** START SERVER
*/
var useCluster = (process.argv[2]==='false') ? false : true,
    appPort = config.port;

useCluster = false; //override

if (useCluster) {
  //USE CLUSTER
  if (cluster.isMaster) {
    // Fork workers.
    for (var i = 0; i < 4; i++) {
      cluster.fork();
    }

    cluster.on('death', function(worker) {
      console.log('worker ' + worker.pid + ' died');
    });
  }
  else {
    // Worker processes have a http server.
    app.listen(appPort, function(){
      console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
    });
  }
}
else {
  //DONT USE CLUSTER
  app.listen(appPort, function(){
    console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
  });
}
