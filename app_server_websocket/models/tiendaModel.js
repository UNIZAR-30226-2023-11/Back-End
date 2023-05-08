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
    }
}, { collection: 'tienda' });


//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloTienda = mongoose.model('tienda', esquema, 'tienda');


module.exports = modeloTienda;