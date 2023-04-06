const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  coordenadas: {
    type: String,
    required: true
  }
}, { collection: 'asignaturas_partida' });

//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloAsignaturaComprada = mongoose.model('asignaturas_partida', esquema);

module.exports = modeloAsignaturaComprada;