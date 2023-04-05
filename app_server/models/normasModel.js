const mongoose = require("mongoose");

const schema = mongoose.Schema;
const esquema = new schema({
    id: { 
        type: Number, 
        required: true 
    },
    descripcion: {
        type: String,
        require: true
    }
  }, { collection: 'info_normas' });
  
//   esquema.index({ nombreUser: 1 }, { unique: true }); // Crea un índice único en el campo "nombre"
  
  const modeloNormas = mongoose.model('info_normas', esquema);
  
  module.exports = modeloNormas;