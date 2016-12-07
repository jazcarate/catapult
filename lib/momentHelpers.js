'use strict';
var moment = require('moment');

exports.moment = function(dia){
  return moment(dia).fromNow();
}