var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes');

// connect to database
mongoose.connect('mongodb://root:root@ds023465.mlab.com:23465/order_transaction');

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser());

// create session store
app.use(session({
  cookie: {
    maxAge: 60 * 60 * 1000 // 1 hour
  },
  resave: false,
  saveUninitialized: true,
  secret: 'foo',
  store: new MongoStore({
    clear_interval: 3600,
    mongooseConnection: mongoose.connection,
    ttl: 60 * 60 // 1 hour
  })
}));
app.use(routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
