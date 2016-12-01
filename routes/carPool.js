var express = require('express')
  , router = express.Router()
  , config = require('../config');

router.get('/', function(req, res, next){
  var e = {
    destination: 'st louis, mo',
    departures: ['chicago, il', 'Vancouver']
  };
  
  res.render('index', { api: config.application.gmaps_api, event: e });
});

module.exports = router;
