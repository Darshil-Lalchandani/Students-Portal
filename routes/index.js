var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

function ensureAuthenticated(req, res, next) {
    if(req.isAuthenticated()) {
      return next();
    } else {
      //req.flash('success', 'Please Log In');
      res.redirect('/users/login');
    }
}

module.exports = router;
