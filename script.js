/*const mymap = L.map('sample_map').setView([40.741, -3.884], 15);*/
const mymap = L.map('sample_map').locate({setView: true, maxZoom: 15});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);


/* Funcion que pone un marcador*/
let marker = "";
let marketLatitude = "";
let marketLongitude = "";
mymap.on('click', function(e) {
  marketLatitude = e.latlng.lat;
  marketLongitude = e.latlng.lng;
  console.log(marketLatitude)
  comprobarDistancia();
  /* Si no hay ningun marcador anterior*/
  if (marker == ""){
    /* Pone un marcador donde haya pulsado el usuario */
    marker = L.marker(e.latlng).addTo(mymap);}
  else {
    marker.setLatLng(e.latlng);
  }
  marker.bindPopup("Destino");
})


var greenIcon = L.icon({
  iconUrl: 'TuPosicion.png',
  /*iconAnchor:   [22, 94],*/
  /*iconSize:     [38, 95],*/
});


let myLatitude; // Latitud del usuario
let myLongitude; // Longitud del usuario
/* Marcador inicial con tu ubicacion */
var tuUbicacion = L.marker([0, 0]).addTo(mymap);
/* Actualiza tu ubicacion, cada vez que cambia */
navigator.geolocation.watchPosition(actualizarPos);

let radioNoti = 2000/1000; // Radio al que va a vibrar el movil

function actualizarPos(position) {
  /* Actualiza las posciones del usuario */
  myLatitude = position.coords.latitude;
  myLongitude = position.coords.longitude;
  /* Cambia el marcador de la posicion del usuario */
  tuUbicacion.setLatLng([myLatitude, myLongitude]);
  comprobarDistancia();

}
var audio = new Audio('Mario.mp3');
function comprobarDistancia (){
    /* Comprueba que el marcador este a la distancia establecida */
    console.log()
    radio = (document.getElementById("distancia").value)/1000;
  
    if (radio < 0 || radio == ""){
      radio = radioNoti;
    }
    console.log(radioNoti)
    if (calcularDistancia(myLatitude , myLongitude , marketLatitude , marketLongitude) < radio) {
      console.log('Felicidades, has llegado a tu destino.');
      if ('vibrate' in navigator) {
        navigator.vibrate(1000);
        audio.play();
        $(".apagar").show();
      }
      else {
        console.log("Error, tu navegador no soporta la API de vibración")
      }
    }
}
function calcularDistancia (latX , lngX , latY , lngY){
  /* Funcion que dadas dos coordenadas calcula la distancia */
  console.log(latX , lngX, latY , lngY);
  const rTierra = 6371;
  let diffLat = toRad(latX - latY);
  let diffLng = toRad(lngX - lngY);
  let a = Math.pow(Math.sin(diffLat/2), 2) + Math.cos(latX) * Math.cos(latY) * Math.pow(Math.sin(diffLng/2) , 2);
  let c = 2 * Math.atan2(Math.sqrt(a) , Math.sqrt(1-a));
  let dist = c*rTierra;
  return dist
}

function toRad (grados) {
  /* Funcion que pasa de grados a radianes */
  let radianes = grados * (Math.PI / 180);
  return radianes;
}

function centrar() {
  /* Funcion que centra la vision del mapa cuando se le da al boton de centrar */
  mymap.setView([myLatitude , myLongitude] , 15);
}

$(".apagar").hide();
function apagarAlarma(){
  $(".apagar").hide();
  audio.pause();
}
