const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
    nombre: {
        type: String,
        required: true
    },
    imagen: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    comprado: {
        type: Boolean,
        required: true, 
        default: false
    },
    usado: {
        type: Boolean,
        required: true,
        default: false
    }
}, { collection: 'tienda' });

const modeloTienda = mongoose.model('tienda', esquema, 'tienda');

module.exports = modeloTienda;