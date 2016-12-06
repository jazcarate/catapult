/*global next*/

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

function _identity(x){
  return x;
}

var AutoSchema = new Schema({
  	duenio: String,
  	ruta: Object,
	  asientosLibres: Number,
});

var EventoSchema = new Schema({
	nombre: String,
	dia: Date,
	autos: [AutoSchema],
	destino: String,
	descripcion: String,
});

EventoSchema.methods.calcularSalidas = function () {
  return this.autos.map(function(auto){
    return auto.ruta;
  });
};

EventoSchema.methods.agregarAuto = function(duenio, ruta, asientosLibres, cb) {
  cb = cb || _identity;
  var auto = {
  	duenio: duenio,
  	ruta: ruta,
	  asientosLibres: asientosLibres,
  };
  this.autos.push(auto),
  this.save(cb);
};
  
var Evento = mongoose.model('Evento', EventoSchema);

Evento.Schema = EventoSchema;

Evento.crear = function(nombre, dia, descripcion, destino, cb){
    var evento = {
      nombre: nombre,
      dia: dia,
      destino: destino,
      descripcion: descripcion,
      autos: [],
    };
    
    return Evento.create(evento, function (err, kudo) {
      if (err) return next(err);
      return cb(kudo);
    });
};


Evento.encontrar = function(cual, cb){
  cb = cb || _identity;

 return Evento.findById( mongoose.Types.ObjectId(cual), cb);
};


module.exports = Evento;
