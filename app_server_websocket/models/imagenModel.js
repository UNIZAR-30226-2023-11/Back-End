const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  _id: {
    type: ObjectId,
    required: true
  },
  imagen: {
    type: String,
    required: true
  }
}, { collection: 'imagenes' });


//esquema.index({ nombre: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"

const modeloImagen = mongoose.model('imagenes', esquema, 'imagenes');


module.exports = modeloImagen;