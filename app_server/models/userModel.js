const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  nombre: String,
  telefono: Number
}, { collection: 'usuarios' });

const modeloUser = mongoose.model('usuarios', esquema);

module.exports = modeloUser;