const mongoose = require("mongoose");

// TODO: Función de gestionar las compras en festividades

const schema = mongoose.Schema;
const esquema = new schema({
  nombre: {
    type: String,
    required: true
  },
  coordenadas: {
    type: {
      h: Number,
      v: Number
    },
    required: true
  },
  precioCompra: {
    type: Number,
    required: true
  },
  matricula: {
    type: Number,
    required: true
  },
  precio2M:{
    type: Number,
    required: true
  },
  precio3M:{
    type: Number,
    required: true
  },
  precio4M:{
    type: Number,
    required: true
  },  
  devolucionMatricula: {
    type: Number,
    required: true
  },
  tipo:{
    type: String,
    required: true
  },
  imagen:{
    type: String,
    required: true
  }
}, { collection: 'info_asignaturas' });

const modeloFestividad = mongoose.model('festividad', esquema, 'info_asignaturas');

module.exports = modeloFestividad;