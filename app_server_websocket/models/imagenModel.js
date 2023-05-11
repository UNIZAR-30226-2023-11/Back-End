const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
  // _id: {
  //   type: ObjectId,
  //   required: true
  // },
  imagen: {
    type: String,
    required: true
  }
}, { collection: 'imagenes' });

const modeloImagen = mongoose.model('imagenes', esquema, 'imagenes');

module.exports = modeloImagen;