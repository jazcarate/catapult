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
    evento.agregarAuto(req.body.duenio, req.body.ruta, req.body.asientosLibres, function(err){
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

router.get('/evento/:evento/', function(req, res, next){
  Evento.encontrar(req.params.evento, function(err, evento){
    if (err) throw err;
    res.render('evento/uno', { api: config.application.gmaps_api, evento: evento, salidas: evento.calcularSalidas() });  
  });
});

router.get('/evento', function(req, res, next){
  res.render('evento/crear');
});


router.get('/', function(req, res, next){
  res.render('index');
});

module.exports = router;
