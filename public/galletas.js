function Galleta(nombre){
    this.nombre = nombre;
}

Galleta.prototype = {
    guardar: function(){
        document.cookie = this.nombre + "=" + this.valor + ";" + this.expiracion + ";path=/";
    },
    expira: function(delay){
        var d = new Date();
        d.setTime(d.getTime() + (delay)); //exdays*24*60*60*1000
        this.expiracion = "expires="+ d.toUTCString();
        return this;
    },
    con: function(valor){
        this.valor = valor;
        return this;
    },
    obtener: function(){
        if( this.valor )
            return this.valor;
        return this.obtenerValor();
    },
    obtenerValor: function(){
        var busqueda = this.nombre + "=";
        var ca = document.cookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0)==' ') {
                c = c.substring(1);
            }
            if (c.indexOf(busqueda) == 0) {
                return c.substring(busqueda.length,c.length);
            }
        }
        return "";
    }
}