const mongoose = require("mongoose");
var modeloNormas = require('../models/normasModel')

//TODO: POSIBLEMENTE UN ARRAY DE OBJETOS CADA USUARIO
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
      type: [{
        h: Number,
        v: Number
      }],
      required: true
    },
    dineroJugadores: {
      type: [Number],
      required: true
    },
    numeroJugadores:{
      type: Number,
      required: true
    },
    carcel:{
      type: [Boolean],
      required: true
    },
    bancarrota:{
      type: [Boolean],
      required: true
    },
    subasta: {
      type: {
        username: String,
        precio: Number,
        coordenadas : {
          h: Number,
          v: Number
        }
      }
    },
    dados: {
      type:{
        dado1: Number,
        dado2: Number,
        jugador: String,
        dobles: Number
      },
      required: true
    }
  }, { collection: 'partida' });
  
const modeloPartida = mongoose.model('partida', esquema);

module.exports = modeloPartida;