const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquemaCasilla = new schema({
    coordenadas: {
      type: String,
      required: true
    },
    precioCompra: {
      type: Number,
      required: true
    },
    tipo:{
      type: String,
      required: true
    }
  });

const modeloCasilla = mongoose.model('casilla', esquemaCasilla, 'info_asignaturas');
module.exports =  modeloCasilla;