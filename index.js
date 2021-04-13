const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let MongoClient = require('mongodb').MongoClient;


let usuario = {
    nombre:'',
    apellido: ''
};

let usuarios = []

let respuesta = {
 error: false,
 codigo: 200,
 mensaje: ''
};


MongoClient.connect('mongodb://matirivas.me:27017', function(err, db) {
  if (err) {
    throw err;
  }
  var dbo = db.db("api");
  dbo.collection("users").find().toArray(function(err, result) {
    if (err) {
      throw err;
    }
    console.log(result);
    usuarios = result;

  });
});



app.get('/', function(req, res) {
 respuesta = {
  error: true,
  codigo: 200,
  mensaje: 'Punto de inicio'
 };
 res.send(respuesta);
});

app.get('/usuario', function (req, res) {
  respuesta = {
   error: false,
   codigo: 200,
   mensaje: 'respuesta del usuario',
   respuesta: usuarios
  }
  res.send(respuesta);
});

app.post('/usuario', function (req, res) {
 if(!req.body.nombre || !req.body.apellido) {
  respuesta = {
   error: true,
   codigo: 502,
   mensaje: 'El campo nombre y apellido son requeridos'
  };
 } else {
  if(usuario.nombre !== '' || usuario.apellido !== '') {
   respuesta = {
    error: true,
    codigo: 503,
    mensaje: 'El usuario ya fue creado previamente'
   };
  } else {
   usuario = {
    nombre: req.body.nombre,
    apellido: req.body.apellido
   };
   respuesta = {
    error: false,
    codigo: 200,
    mensaje: 'Usuario creado',
    respuesta: usuario
   };
  }
 }
 res.send(respuesta);
});


app.put('/usuario', function (req, res) {
 if(!req.body.nombre || !req.body.apellido) {
  respuesta = {
   error: true,
   codigo: 502,
   mensaje: 'El campo nombre y apellido son requeridos'
  };
 } else {
  if(usuario.nombre === '' || usuario.apellido === '') {
   respuesta = {
    error: true,
    codigo: 501,
    mensaje: 'El usuario no ha sido creado'
   };
  } else {
   usuario = {
    nombre: req.body.nombre,
    apellido: req.body.apellido
   };
   respuesta = {
    error: false,
    codigo: 200,
    mensaje: 'Usuario actualizado',
    respuesta: usuario
   };
  }
 }
 res.send(respuesta);
});

app.delete('/usuario', function (req, res) {
 if(usuario.nombre === '' || usuario.apellido === '') {
  respuesta = {
   error: true,
   codigo: 501,
   mensaje: 'El usuario no ha sido creado'
  };
 } else {
  respuesta = {
   error: false,
   codigo: 200,
   mensaje: 'Usuario eliminado'
  };
  usuario = { 
   nombre: '', 
   apellido: '' 
  };
 }
 res.send(respuesta);
});

app.use(function(req, res, next) {
 respuesta = {
  error: true, 
  codigo: 404, 
  mensaje: 'URL no encontrada'
 };
 res.status(404).send(respuesta);
});

app.listen(3000, () => {
 console.log("El servidor está inicializado en el puerto 3000");
});