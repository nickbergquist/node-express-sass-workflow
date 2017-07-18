var express = require('express');
var router = express.Router();

/* GET Products page. */
router.get('/', function(req, res, next) {
  res.render('products', { 
    title: 'Products'
  });
});

module.exports = router;
