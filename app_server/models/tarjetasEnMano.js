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

//esquema.index({ nombreUser: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloTarjetasEnMano = mongoose.model('tarjetas_partida', esquema);

module.exports = modeloTarjetasEnMano;