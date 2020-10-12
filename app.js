var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
var bodyparser = require('body-parser');

var helmet = require('helmet');
var compression = require('compression');
var app = express();
app.use(helmet());


//database
var mongoose = require('mongoose');
var mongoDB = 'mongodb+srv://dbuser:asd@cluster0.g0xzg.mongodb.net/mydb?retryWrites=true&w=majority';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true });
var User = require('./models/user');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//AUTHENTICATION
passport.use(new LocalStrategy(
  function(username, password, cb) {
    User.findOne({username: username})
    .then((user) => {
      
      bcrypt.compare(password, user.password, (err, res) => {
        if(res){
          return cb(null, user);
        } else {
          return cb (null, false);
        }
      }) 
      }).catch((err) => {
        cb(err);
      });
}));

passport.serializeUser(function(user, cb) {
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  User.findById(id, function(err, user){
    if (err) {return cb(err);}
    cb(null, user);
  })
});
app.use(express.static("public"));
app.use(session({ secret: "cats", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));
app.use(bodyparser.urlencoded({ extended: false }));
app.use('/', indexRouter);
app.use('/user', usersRouter);

app.get('/login', (req, res) => {
  if(req.user){
    res.redirect('/');
  }
  res.render('login');
});

app.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/sign-up"
})
); 


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
