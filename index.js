const express = require('express');
const cors = require('cors')
const axios = require('axios')
const Hospital = require('./hospital')
const mongoose = require('mongoose');
const app = express();

const corsOptions = {
  origin: '*',
}

const uri = 'mongodb://matirivas.me:27017/api';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('conectado a mongodb')) 
  .catch(e => console.log('error de conexión', e))

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


let hospitales = []

let respuesta = {
 error: false,
 codigo: 200,
 mensaje: ''
};

let cordenandas = {
  lat: 0,
  lng: 0
}


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
})

app.post('/hospitales', cors(corsOptions), async (req, res) => {
  cordenandas = req.body;
  const hospitalArray = await Hospital.find();
  hospitalArray.forEach(element => {
    element.distance = calculateDistance(cordenandas.lat,cordenandas.lng,element.lat, element.lng);
    hospitales.push(element);
  })
  respuesta = {
    error: false,
    codigo: 200,
    mensaje: 'Operacion Exitosa',
    centros: hospitales
  }
  res.send(respuesta);
});

async function calculateDistance(latOrigin, longOrigin,latDestino, longDestino) {
  axios
  .post('https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&key=AIzaSyCb7ZbDy7nmc7SCKubQXHhDEbdkuYD_ehs&origins='
        + latOrigin +',' + longOrigin 
        + '&destinations=' + latDestino + ',' + longDestino)
  .then(res => {
    return res.data.rows[0].elements[0].distance.text;
  })
  .catch(error => {
    console.error(error)
  });

}


app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});