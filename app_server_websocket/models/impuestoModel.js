const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  nombre: {
    type: String,
    required: true
  },
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
  precioCompra: {
    type: Number,
    required: true
  },
  matricula: {
    type: Number,
    required: true
  },
  imagen: {
    type: String,
    required: true
  }
}, { collection: 'info_asignaturas' });

const modeloImpuesto = mongoose.model('impuesto', esquema, 'info_asignaturas');

module.exports = modeloImpuesto;