var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var { engine } = require('express-handlebars');
var sessions = require('express-session');
var flash = require('express-flash');
var mysqlSession = require('express-mysql-session')(sessions);
const { requestPrint } = require('./helpers/debug/debugprinters');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var postsRouter = require('./routes/posts');
var messagesRouter = require('./routes/messages');

var app = express();

// Handlebar helper used in searchbar.hbs.
// if_equal checks the dropdown option that the user has selected
// and set the value as "selected" and shown on the dropdown menu when page refreshes.
const ifEqualHelper = function (a, b, opts) {
  if (a == b) {
    return opts.fn(this)
  } else {
    return opts.inverse(this)
  }
}

app.engine(
  ".hbs",
  engine({
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    extname: ".hbs",
    defaultLayout: "layout",
    helpers: {
      if_equal: ifEqualHelper,
      emptyObject: (obj) => {
        return !(obj.constructor === Object && Object.keys(obj).length == 0);
      },
    },
  })
);

var mysqlSessionStore = new mysqlSession(
  {
    /* using default options */
  },
  require('./config/database')
);

app.use(sessions({
  key: "csid",
  secret: "secret for 648-07!",
  store: mysqlSessionStore,
  resave: false,
  saveUninitialized: false
}));

app.use(flash());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));

// Set logged in state for request/response cycle
app.use((req, res, next) => {
  if (req.session.username) {
    res.locals.logged = true;
  }
  next();
});

// Print out the route for easy debugging
app.use((req, res, next) => {
  requestPrint(req.url);
  next();
})

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/posts", postsRouter);
app.use("/messages", messagesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
