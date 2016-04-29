var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session');
var bodyParser = require('body-parser');
require('dotenv').config()


var api = require('./api/redditApi');

var app = express();

var port = process.env.PORT || 3000;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cookieSession({
    name: 'session',
    keys: [
      "21e998e73043068cadda1f74fa87e5ede3d17143d3ae49e5c28b8f11ca799e2b5e7ad9b31ba9735ae9dd6a7b4eadd9ff",
      "58e14b78cc79272fb1a29cf0e1ade7bdd78fd9eb56c1183b27f9a61a2fc47176cc5da2eaa5a24617c0f877481327d75f",
      "b443fddc8a6a1521afbdd7ce8b451c53f74a41e29c5aa78e9e00ce3937a182c52c66c18db70d04a0c20cf2abc6391efa"
    ]
}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', api);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var server = app.listen(port, function(){
  console.log ("Listening on " + port)
});


module.exports = app;
