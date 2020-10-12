const e = require('express');
var express = require('express');
const user = require('../models/user');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.redirect('/');
});

router.get('/:id', function(req, res){
  if (!req.user){
    res.redirect('/login');
  } else{
    User.findById(req.params.id).exec(function (err, user) {
        if(err){
          res.redirect('/');
        } else{
          res.render('userinfo', {title: user.full_name + ' | Profile', user: user});
        }
    })
  }
});



module.exports = router;
