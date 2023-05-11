const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  nombre: {
    type: String,
    required: true
  },
  cuatrimestre: {
    type: Number,
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
  precio1C:{
    type: Number,
    required: true
  },
  precio2C:{
    type: Number,
    required: true
  },
  precio3C:{
    type: Number,
    required: true
  },
  precio4C:{
    type: Number,
    required: true
  },
  precioCompraCreditos:{
    type: Number,
    required: true
  },  
  devolucionMatricula: {
    type: Number,
    required: true
  }
}, { collection: 'info_asignaturas' });

const modeloAsignatura = mongoose.model('asignaturas', esquema, 'info_asignaturas');

module.exports = modeloAsignatura;