var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/maps', function(req, res, next) {
  res.render('maps');
});

router.get('/recent', function(req, res, next) {
  res.render('recent');
})

module.exports = router;
