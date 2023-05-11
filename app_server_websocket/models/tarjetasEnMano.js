const mongoose = require("mongoose");

const schema = mongoose.Schema;

const esquema = new schema({
  nombre: {
    type: String,
    required: true
  },
  partida: {
    type: Number,
    required: true
  },
  jugador: {
    type: String,
    required: true
  }
}, { collection: 'tarjetas_partida' });

const modeloTarjetasEnMano = mongoose.model('tarjetas_partida', esquema);

module.exports = modeloTarjetasEnMano;