const mongoose = require("mongoose");

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
  // cuatrimestre: {
  //   type: Number,
  //   required: true
  // },
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
  }
}, { collection: 'info_asignaturas' });


//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloFestividad = mongoose.model('festividad', esquema, 'info_asignaturas');


module.exports = modeloFestividad;