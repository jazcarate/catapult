var colores = ['#FE7569', '#9e19f3', '#00d719', '#5af0e6', '#c16db9' ];

function obtenerColor(i){
    return colores[i % colores.length];
}

function colorear(c){
    var elementos = document.getElementsByClassName(c);
    for (var i = 0; i < elementos.length; i++) {
       elementos[i].style.color=obtenerColor(i);
    }
}