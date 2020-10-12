var express = require('express');
var router = express.Router();
const validator = require('express-validator');
var User = require('../models/user')
var bcrypt = require('bcryptjs');
var Message = require('../models/messages');
const { validationResult } = require('express-validator');





/* GET home page. */

router.get('/', function(req, res, next) {
  Message.find().populate('author').exec(function (err, messages) {
    if(err){
      return;
    }
    res.render('index', { title: 'Super Secret Ichiraku Ramen Club', user: req.user, messages: messages }); 
  })
  
});


router.get('/sign-up', function(req, res){
  res.render('sign-up', { title: 'Sign Up | Secret club' });
})

router.post('/sign-up', [
  validator.body('first_name').isLength({min: 1}).trim().isAlphanumeric(),
  validator.body('last_name').isLength({min: 1}).trim().isAlphanumeric(),
  validator.body('username').isLength({min: 5}).trim().isAlphanumeric(),
  validator.body('password').isLength({min: 5}).trim(),

  validator.sanitizeBody('first_name').escape(),
  validator.sanitizeBody('last_name').escape(),
  validator.sanitizeBody('username').escape(),
  validator.sanitizeBody('password').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    if(!errors.isEmpty()){
      res.render('sign-up', {errors: errors.array()})
      return;
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      var user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        username: req.body.username,
        password: hashedPassword
      });
      user.save(function(err){
        if (err) {return;}
        res.redirect('/login');
      });
    })
  }
])

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/become-a-member', (req, res) => {
  if(req.user){
    if(req.user.membership == true){
      res.redirect('/');
    } else{
      res.render('become-a-member');
    }
  } else{
    res.redirect('/login');
  }
});

router.post('/become-a-member', (req, res) => {
  if(req.user){
    if(req.user.membership == true){
      res.redirect('/');
    } else{
      validator.body('secretcode').escape().trim();

      if(req.body.secretcode == 'lana del rey'){
        User.findById(req.user._id).exec(function (err, user){
          user.membership = true;
          user.save();
        })
      } else{
        res.redirect('/become-a-memner')
      }
    }
  } else{
    res.redirect('/');
  }
})

router.get('/create-message', (req, res) => {
  if(req.user && req.user.membership == true){
    res.render('create-message', {fullname: req.user.first_name + ' ' + req.user.last_name, user: req.user})
  } else{
    res.redirect('/');
  }
})

router.post('/create-message', [
  
  // validator.body('text').isLength({min: 1, max: 400}),
  validator.body('text').escape().trim(),
  (req, res) => {
    const errors = validator.validationResult(req);
    if(!errors.isEmpty()){
      return;
    }
    var message = new Message({
      text: req.body.text,
      author: req.user._id
    })
    
    message.save(function(err){
      if (err) {
        res.redirect('/create-message');
        return;
      }
      res.redirect('/');
    })
  }
])


module.exports = router;
