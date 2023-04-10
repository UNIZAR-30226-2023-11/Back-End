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
  }
}, { collection: 'asignaturas_partida' });

//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloAsignaturaComprada = mongoose.model('asignaturas_partida', esquema);

module.exports = modeloAsignaturaComprada;