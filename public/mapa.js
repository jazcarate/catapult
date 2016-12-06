/* global google */
var colores = ['#5cb85c', 'blue', 'red', 'violet' ];

function Mapa(mapaID, opciones){
    this.mapa = new google.maps.Map(
        document.getElementById(mapaID),
        {
            'zoom':12,
            'mapTypeId': google.maps.MapTypeId.ROADMAP
        }
    );
    this.ser = new google.maps.DirectionsService();
}

Mapa.prototype = {
    obtenerRenderer: function(opciones){
        var ren = new google.maps.DirectionsRenderer(
            Object.assign(
                {
                    'draggable':  false
                },
                opciones
            )
        );
        ren.setMap(this.mapa);
        return ren;
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
    
    guardar: function(){
        var w=[], data={};
        var rleg = this.ren.directions.routes[0].legs[0];
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