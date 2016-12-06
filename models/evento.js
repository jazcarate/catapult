/*global next*/

var mongoose = require('mongoose')
  , Schema = mongoose.Schema;

function _identity(x){
  return x;
}

var AutoSchema = new Schema({
  	duenio: String,
  	ruta: Object,
	  asientosTotales: Number,
	  ocupantes: [String],
});

var EventoSchema = new Schema({
	nombre: String,
	dia: Date,
	autos: [AutoSchema],
	destino: String,
	descripcion: String,
});

EventoSchema.methods.editarOcupantes = function (ocupantes, cb) {
  cb = cb || _identity;
  var self = this;
  Object.keys(ocupantes).forEach(function(key,index) {
    
    var auto = self.autos.find(function(unAuto){
      return unAuto.duenio ==  key; 
    });
    
    auto.ocupantes = ocupantes[key];
  });
  this.save(cb);
};

EventoSchema.methods.maximaCapacidad = function() {
  return Math.max.apply(null, this.autos.map(function(auto){
    return auto.asientosTotales || 0;
  }));
};

EventoSchema.methods.agregarAuto = function(duenio, ruta, asientosTotales, cb) {
  cb = cb || _identity;
  var auto = {
  	duenio: duenio,
  	ruta: ruta,
	  asientosTotales: asientosTotales,
	  ocupantes: []
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
