var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer({dest : './uploads'});
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', {title : 'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login', {title : 'Login'});
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy({usernameField : 'rollno'}, function(rollno, password, done){
  User.getUserByUsername(rollno, function(err, user){
    if(err) throw err;
    if(!user) {
      return done(null, false, {message : 'Unknown User'});
    }

    User.comparePassword(password, user.password, function(err, isMatch){
      if(err) return done(err)
      if(isMatch) {
        return done(null, user);
      } else {
         return done(null, false, {message : 'Invalid Password'});
      }
    })
  });
}));

router.post('/login',
  passport.authenticate('local', {failureRedirect : '/users/login', failureFlash : 'Invalid username or password'}),
  function(req, res) {
    req.flash('success', 'You are now Logged In');
    res.redirect('/');
  });


router.post('/register',upload.single('profileimage'), function(req, res, next) {
  var rollno = req.body.rollno;
  var name = req.body.name;
  var email = req.body.email;
  var password = req.body.password;
  var pass2 = req.body.password2;
  if(req.file) {
    console.log('Uploading file');
    var profileimage = req.file.filename;
  } else {
    console.log('No file uploaded');
    var profileimage = 'noimage.jpg';
  }
  //Form Validator
  console.log(req.body);
  const validRoll = new RegExp('^UI[0-9][0-9][CE][OC][0-9][0-9]$');
  const validName = new RegExp('^[a-zA-Z][a-zA-Z .\'-]*$');
  if(!validRoll.test(rollno)) { res.render('register',{ errors : 'Please enter valid Roll-no' }); }
  else if(!validName.test(name)) { res.render('register',{ errors : 'Please enter valid Name' }); }
  else if(!email) { res.render('register',{ errors : 'Please enter Email' }); }
  else if(!password || password.length < 5) { res.render('register',{ errors : 'Please enter valid Password' }); }
  else if(password != pass2) { res.render('register',{ errors : 'Please enter same password' }); }
  else {
    var NewUser = new User({
      rollno : rollno,
      name : name,
      email : email,
      password : password,
      profileimage : profileimage,
    });
    User.createUser(NewUser, function(err, user) {
      if(err) throw err;
      console.log(user);
    });

    req.flash('success', 'Registered successfully. Please LogIn');

    res.location('/');
    res.redirect('/');
  }
});

module.exports = router;
