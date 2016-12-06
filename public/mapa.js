/* global google */
var colores = ['#5cb85c', 'blue', 'red', 'violet' ];

function Mapa(mapaID, opciones){
    this.mapa = new google.maps.Map(
        document.getElementById(mapaID),
        {
            center: {
                lat: -34.60368440000001,
                lng: -58.381559100000004
            },
            'zoom':12,
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
                    self.obtenerRenderer({draggable: true}).setDirections(res);
            }
        );
    },
    
    autocomplete: function(inputId){
        var self = this;
        var input = document.getElementById(inputId);
        var searchBox = new google.maps.places.SearchBox(input);
        self.mapa.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
        self.mapa.addListener('bounds_changed', function() {
          searchBox.setBounds(self.mapa.getBounds());
        });
        
        var markers = [];
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

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
    
    variasRutas: function(rutas){
        var self = this;
        
        var i=0;
        rutas.forEach(function(unaRuta){
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
                    strokeColor: colores[i++],
                },
                markerOptions: {
                    icon: google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
                }
            };
            
            self.ser.route(
                {
                    'origin':new google.maps.LatLng(unaRuta.start.lat,unaRuta.start.lng),
                    'destination':new google.maps.LatLng(unaRuta.end.lat,unaRuta.end.lng),
                    'waypoints': wp,
                    'travelMode': google.maps.DirectionsTravelMode.DRIVING
                },
                function(res,sts) {
                    if(sts==google.maps.DirectionsStatus.OK)
                        self.obtenerRenderer(opciones).setDirections(res);
                }
            );
        });
    },
    
};