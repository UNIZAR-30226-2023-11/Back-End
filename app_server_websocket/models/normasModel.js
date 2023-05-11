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
    
  const modeloNormas = mongoose.model('info_normas', esquema);
  
  module.exports = modeloNormas;