var express = require('express')
  , router = express.Router()
  , Evento = require("../models/evento")
  , config = require('../config');

router.post('/nuevoEvento', function(req, res, next){
  Evento.crear(req.body.nombre, req.body.dia, req.body.descripcion, req.body.destino,
    function(evento){
      res.redirect(`evento/${evento._id}/auto`);
    }
  );
});

router.post('/nuevoAuto', function(req, res, next){
  Evento.encontrar(req.body.evento, function(err, evento){
    if (err) throw err;
    evento.agregarAuto(req.body.duenio, req.body.ruta, req.body.asientosTotales, function(err){
      if (err) throw err;
      res.redirect(`/evento/${evento._id}`);
    });
  });
});

router.get('/evento/:evento/auto', function(req, res, next){
  Evento.encontrar(req.params.evento, function(err, evento){
    if (err) throw err;
    res.render('evento/agregarAuto', { api: config.application.gmaps_api, evento: evento });  
  });
});

router.post('/evento/:evento/', function(req, res, next){
  Evento.encontrar(req.params.evento, function(err, evento){
    if (err) throw err;
    evento.editarOcupantes(req.body.ocupantes, function(){
      res.redirect(`/evento/${req.params.evento}`);
    })
  });
});

router.get('/evento/:evento/', function(req, res, next){
  Evento.encontrar(req.params.evento, function(err, evento){
    if (err) throw err;
    res.render('evento/uno', { api: config.application.gmaps_api, evento: evento, maximaCapacidad: evento.maximaCapacidad() });  
  });
});

router.get('/evento', function(req, res, next){
  res.render('evento/crear');
});


router.get('/', function(req, res, next){
  res.render('index');
});

module.exports = router;
