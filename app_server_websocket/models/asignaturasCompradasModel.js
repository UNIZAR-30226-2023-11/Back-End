const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  coordenadas: {
    type: {
      h: Number,
      v: Number
    },
    required: true
  },
  nombre: {
    type: String,
    required:true
  },
  cuatrimestre: {
    type: Number,
    required: true
  },
  partida:{
    type: Number,
    required: true
  },
  jugador:{
    type: String,
    required: true
  },
  precio:{
    type: Number,
    required: true
  },
  hipotecada: {
    type: Boolean,
    required: true,
    default: false
  }
}, { collection: 'asignaturas_partida' });

const modeloAsignaturaComprada = mongoose.model('asignaturas_partida', esquema);

module.exports = modeloAsignaturaComprada;