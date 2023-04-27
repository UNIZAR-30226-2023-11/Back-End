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
  precio1Credito:{
    type: Number,
    required: true
  },
  precio2Creditos:{
    type: Number,
    required: true
  },
  precio3Creditos:{
    type: Number,
    required: true
  },
  precio4Creditos:{
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


//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloAsignatura = mongoose.model('asignaturas', esquema, 'info_asignaturas');


module.exports = modeloAsignatura;