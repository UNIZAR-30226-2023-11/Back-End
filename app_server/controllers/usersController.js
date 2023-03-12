var config = require('../config/config');
var modeloUser = require('../models/userModel')
const  mongoose = require("mongoose");

async function createUser(req, res, next){
    console.log("***POST METHOD Creacion de Usuario");

    req.params

    const doc = new modeloUser({
        nombre: req.params.nombre,
        telefono: req.params.telefono
        // nombre: req.body.nombre,
        // telefono: req.body.telefono
    });

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        await doc.save();
        console.log('Documento guardado correctamente')
        // res.status(201).json({message: 'Usuario creado correctamente'})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al crear usuario'});
    }
}

async function deleteUser(req, res, next){
    console.log("***POST METHOD Eliminación de Usuario");
}

module.exports = {createUser, deleteUser};
