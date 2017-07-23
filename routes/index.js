var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { 
    title: 'Home',
    bodyclass: 'page-home',
    assets: (process.env.NODE_ENV === 'production') ? 'dist' : 'build',
    date: new Date().toDateString()
  });
});

module.exports = router;
