var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var products = require('./routes/products');
var about = require('./routes/about');
var contact = require('./routes/contact');

var app = express();

console.log('process.env.NODE_ENV : ' + process.env.NODE_ENV)

app.set('processed_assets_path', (process.env.NODE_ENV === 'production') ? 'dist' : 'build');

console.log('processed_assets_path : ' + app.get('processed_assets_path'));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// place favicon in /build
//app.use(favicon(path.join(__dirname, 'build', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, app.get('processed_assets_path'))));

app.use('/', index);
app.use('/products', products);
app.use('/about', about);
app.use('/contact', contact);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
