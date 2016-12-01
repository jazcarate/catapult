var mongoose = require('mongoose')
  , moment = require('moment')
  , Schema = mongoose.Schema;

var PersonaSchema = new Schema({
	nombre: String,
	origen: String,
	actualizado: { type: Date, default: Date.now }
});
  
var AutoSchema = new Schema({
  asientos: Number,
  deQuien: PersonaSchema,
  ocupantes: [PersonaSchema]
  actualizado: { type: Date, default: Date.now }
});

var Auto = mongoose.model('Auto', AutoSchema);

function _identity(x){
  return x;
}

Auto.crear = function(auto, cb){
    cb = cb || _identity;
    
    return Auto.create(auto, function (err, kudo) {
      if (err) return next(err);
      return cb(kudo);
    });
};

module.exports = Auto;
