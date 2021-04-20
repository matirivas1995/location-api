const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hospitalesSchema = new Schema({
    _id: String,
    address: String,
    id: String,
    lat: String,
    lng: String,
    name: String,
    phone: String,
    distance: String
});

function setDistance(distance){
    hospitalesSchema.distance = distance;
}

// Crear el modelo
const Hospital = mongoose.model('hospitales', hospitalesSchema);

module.exports = Hospital;