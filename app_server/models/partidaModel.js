const mongoose = require("mongoose");
var modeloNormas = require('../models/normasModel')


const schema = mongoose.Schema;
const esquema = new schema({
    id: {
      type: Number,
      required: true
    },
    nombreJugadores: {
      type: [String],
      required: true
    },
    posicionJugadores: {
      type: [Number],
      required: true
    },
    dineroJugadores: {
      type: [Number],
      required: true
    }
    // ,
    // normas: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'modeloNormas',
    //   required: true
    // }
  }, { collection: 'partida' });
  
//   esquema.index({ nombreUser: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"
  
  const modeloPartida = mongoose.model('partida', esquema);
  
  module.exports = modeloPartida;