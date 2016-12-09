/* global google */
function Mapa(mapaID, opciones){
    this.mapa = new google.maps.Map(
        document.getElementById(mapaID),
        {
            center: {
                lat: -34.60368440000001,
                lng: -58.381559100000004
            },
            'zoom':7,
            styles: estiloMapa,
            disableDefaultUI: true,
            'mapTypeId': google.maps.MapTypeId.ROADMAP
        }
    );
    
    this.ser = new google.maps.DirectionsService();
}

Mapa.prototype = {
    obtenerRenderer: function(opciones){
        this.ren = new google.maps.DirectionsRenderer(
            Object.assign(
                {
                    'draggable':  false
                },
                opciones
            )
        );
        this.ren.setMap(this.mapa);
        return this.ren;
    },
    getUltimoRen: function(){
        return this.ren;
    },
    
    ruta: function(origen, destino){
        var self = this;
        self.ser.route(
            {
                'origin': origen,
                'destination':  destino,
                'travelMode': google.maps.DirectionsTravelMode.DRIVING,
            },
            function(res,sts) {
                if(sts=='OK')
                    self.getUltimoRen().setDirections(res);
            }
        );
    },
    
    autocompleteMarcas: function(inputId){
        var self = this;
        var markers = [];
        self.autocomplete(inputId, function(places){
            if (places.length == 0) return;
        
            //Borrar los marcadores
            markers.forEach(function(marker) {
                marker.setMap(null);
            });
            markers = [];
            
            var bounds = new google.maps.LatLngBounds();
            places.forEach(function(place) {
                if (!place.geometry) {
                    console.log("El lugar no tiene geometria.");
                    return;
                }
            
                var poi = new google.maps.Marker({
                    draggable: true,
                    map: self.mapa,
                    title: place.name,
                    position: place.geometry.location
                });
                
                markers.push(poi);
                self.setMarca(place.geometry.location);
                
                google.maps.event.addListener(poi, 'dragend', function(e) {
                    self.setMarca(this.getPosition());
                });
                
                if (place.geometry.viewport) {
                    bounds.union(place.geometry.viewport);
                } else {
                    bounds.extend(place.geometry.location);
                }
            });
            self.mapa.fitBounds(bounds);
        });
    },
    
    autocompleteRuta: function(inputId, destino){
        var self = this;
        
        self.obtenerRenderer({draggable: true});
        self.ruta(
            new google.maps.LatLng(-34.60368440000001, -58.381559100000004),
            destino);
        
        self.autocomplete(inputId, function(places, input){
            input.value = places[0].formatted_address
            self.ruta(places[0].geometry.location, destino);
        });
    },
    
    autocomplete: function(inputId, cb){
        var self = this;
        var input = document.getElementById(inputId);
        var searchBox = new google.maps.places.SearchBox(input);
        self.mapa.addListener('bounds_changed', function() {
          searchBox.setBounds(self.mapa.getBounds());
        });
        
        searchBox.addListener('places_changed', function() {
            var places = searchBox.getPlaces();
            cb(places, input);
        });
    },
    
    setMarca: function(pos){
        this.marca = pos.toString();
    },
    
    guardar: function(){
        var w=[], data={};
        var rleg = this.getUltimoRen().directions.routes[0].legs[0];
        data.start = {'lat': rleg.start_location.lat(), 'lng':rleg.start_location.lng()};
        data.end = {'lat': rleg.end_location.lat(), 'lng':rleg.end_location.lng()};
        var wp = rleg.via_waypoints;
        for(var i=0;i<wp.length;i++)w[i] = [wp[i].lat(),wp[i].lng()];
        data.waypoints = w;
         
        return JSON.stringify(data);
    },
    
    aCoordenada: function(s){
        var input = s.replace('(', '')
                     .split(",", 2);
        var lat = parseFloat(input[0]);
        var lng = parseFloat(input[1]);
        return new google.maps.LatLng(lat, lng);  
    },
    
    variasRutas: function(destino, autos, coloreo){
        var self = this;
        var bound = new google.maps.LatLngBounds();
        
        var i=0;
        autos.forEach(function(unAuto){
            var unaRuta = rutaDe(unAuto);
            var wp = unaRuta.waypoints.map(function(waypoint){
                return {
                    'location': new google.maps.LatLng(
                        waypoint[0], waypoint[1]
                    ),
                    'stopover':false
                };
            });
            
            var opciones = {
                polylineOptions: {
                    strokeColor: coloreo(i),
                },
                suppressMarkers: true,
                preserveViewport: true
            };
            
            var inicio = new google.maps.LatLng(unaRuta.start.lat,unaRuta.start.lng);
            var fin = new google.maps.LatLng(unaRuta.end.lat,unaRuta.end.lng);
            self.ser.route(
                {
                    'origin': inicio,
                    'destination': fin,
                    'waypoints': wp,
                    'travelMode': google.maps.DirectionsTravelMode.DRIVING
                },
                function(res,sts) {
                    if(sts==google.maps.DirectionsStatus.OK){
                        self.obtenerRenderer(opciones).setDirections(res);
                        bound = bound.union(res.routes[0].bounds);
                        self.mapa.fitBounds(bound);
                    }
                }
            );
            self.marcar(inicio, 'https://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|' + coloreo(i).substring(1), unAuto);
            self.marcar(fin);
            i++;
        });
    },
    
    marcar: function(pos, img, auto){
        var self = this;
        var marcador = new google.maps.Marker({
            position: pos,
            map: self.mapa,
            icon: img || {
                url: '/destino.png',
                size: new google.maps.Size(50, 65),
                origin: new google.maps.Point(0, 0),
                anchor: new google.maps.Point(0, 64)
            }
        });
        if( !(auto === undefined) ){
            var infowindow = new google.maps.InfoWindow({
                content: armarContenido(auto)
            });
            marcador.addListener('click', function() {
                infowindow.open(self.mapa, marcador);
            });
        }
    },
};

function armarContenido(c){
    return '<div id="content">'+
          '<h1 id="firstHeading" class="firstHeading">Auto de ' + c.duenio + '</h1>'+
          '<div id="bodyContent">'+
             '<p>De <strong>' + c.asientosTotales + '</strong> lugares, le quedan <strong>' + (c.asientosTotales - c.ocupantes.length) + '</strong></p>'+
             '<p>Sumate apretando la ventana de "Autos" a la derecha!</p>'+
          '</div>'+
      '</div>';
}

function rutaDe(auto){
  return JSON.parse(auto.ruta);
}