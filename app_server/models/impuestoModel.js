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
  hipoteca: {
    type: Number,
    required: true
  }
}, { collection: 'info_asignaturas' });


//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloImpuesto = mongoose.model('impuesto', esquema, 'info_asignaturas');


module.exports = modeloImpuesto;