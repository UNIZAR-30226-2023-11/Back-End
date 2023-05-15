const mongoose = require("mongoose");

// // Eliminar ------------
// const imagenSchema = new mongoose.Schema({
//   imagen: { type: String, required: true },
//   descripcion: String,
//   }, { collection: 'imagenes' });
//   const Imagen = mongoose.model('Imagen', imagenSchema);
// // ------------------------

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
  imagen: {
    type: String, 
    required: false
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
  partidasEnJuego: {
    type: Number,
    required: true
  },
  productosComprados: {
    type: [String],
    required: true,
    default: []
  },
  token:{
    type: String,
    required: true
  },
  partidaActiva: {
    type: Number,
    required: true,
    default: 0
  }

}, { collection: 'usuarios' });

const modeloUser = mongoose.model('usuarios', esquema);

module.exports = modeloUser;