const mongoose = require("mongoose");

// Eliminar ------------
const imagenSchema = new mongoose.Schema({
  imagen: { type: String, required: true },
  descripcion: String,
  }, { collection: 'imagenes' });
  const Imagen = mongoose.model('Imagen', imagenSchema);
// ------------------------

const schema = mongoose.Schema;
const esquema = new schema({
  nombreUser: {
    type: String,
    required: true
  },
  correo: {
    type: String,
    required: true
  },
  contraseña: {
    type: String,
    required: true
  },
  // contraseñaDos: {
  //   type: String,
  //   required: false
  // },
  imagen: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Imagen',
    required: true
  },
  monedas: {
    type: Number,
    required: true
  },
  victorias: {
    type: Number,
    required: true
  },
  partidasJugadas: {
    type: Number,
    required: true
  },
  productosComprados: {
    type: Number,
    required: true
  },
  partidasEnJuego: {
    type: Number,
    required: true
  }
}, { collection: 'usuarios' });

// esquema.index({ nombreUser: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloUser = mongoose.model('usuarios', esquema);

module.exports = modeloUser;