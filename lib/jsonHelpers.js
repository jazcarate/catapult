'use strict';
var Handlebars  = require('handlebars');

exports.json = function (msg) {
  return Handlebars.SafeString(JSON.stringify(msg));
};