const mongoose = require("mongoose");

const schema = mongoose.Schema;

const esquema = new schema({
  nombre: {
    type: String,
    required: true
  },
  descripcion: {
    type: String,
    required: true
  },
  cobrarPagarNada: {
    type: String,
    required: true
  },
  dinero:{
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    required: true
  }
}, { collection: 'info_tarjetas' });

//esquema.index({ nombreUser: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloTarjetas = mongoose.model('info_tarjetas', esquema);

module.exports = modeloTarjetas;