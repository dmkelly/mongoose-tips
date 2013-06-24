var _ = require('underscore');
var express = require('express');
var http = require('http');
var async = require('async');
var config = require('./config');
var router = require('./router');
var services = require('./services');
var mid = require('./middleware');
var app = express();
var server = http.createServer(app);
var started = false;

app.configure(function() {
  app.use(express.compress());
  app.set('view engine', 'jade');
  app.set('views', __dirname + '/../template');
  app.use(express.cookieParser());
  app.use(express.bodyParser());
  app.use(express.favicon());
  app.use(express.session({
    key: 'demo.sid',
    secret: '36W79GArUcUKSafQeUAG'
  }));
  app.use(express.static(__dirname + '/../public'));
  app.locals = _.extend(app.locals, config.locals);
  app.use(mid.attachResponseHandlers);
  app.use(mid.attachSessionUser);
  app.use(app.router);
  router(app);
});

function start(callback) {
  server.listen(config.server.PORT, callback);
}

function terminator(sig) {
  services.mongo.disconnect(function() {
    console.log('Disconnected from MongoDB');
    if (typeof sig === "string") {
      console.log(Date(Date.now()) + ': Received ' + sig +
        ' - terminating Node server ...');
      process.exit(0);
    }
    if (started) {
      console.log(Date(Date.now()) + ': Node server stopped.');
    }
  });
}

process.on('exit', function() {
  terminator();
});

['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT', 'SIGBUS',
  'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGPIPE', 'SIGTERM'].forEach(function(element) {
  process.on(element, function() {
    terminator(element);
  });
});

async.series([
  async.apply(services.mongo.connect, config.mongo.URL),
  start
], function(err) {
  if (err) {
    throw err;
  }
  started = true;
  console.log('Listening on port %d', config.server.PORT);
});
