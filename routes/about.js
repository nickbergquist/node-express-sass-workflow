var express = require('express');
var router = express.Router();

/* GET About page. */
router.get('/', function(req, res, next) {
  res.render('about', { 
    title: 'About',
    bodyclass: 'page-about'
  });
});

module.exports = router;
