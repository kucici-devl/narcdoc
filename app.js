// SET DEBUG=narcodoc:* & npm start
//auto reload(https://hinoshita.hatenadiary.com/entry/2018/06/05/141409)
// npm install -D nodemon
// npx nodemon ./bin/www
var createError = require('http-errors');
var express = require('express');
var helmet = require('helmet');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
//helmet 外部js読み込むため

app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          "script-src": ["'self'","unsafe-inline","cdn.jsdelivr.net"], // <4>
        },
      },
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/topdf', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
