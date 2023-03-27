var config = require('../config/config');
var modeloUser = require('../models/userModel')
const  mongoose = require("mongoose");

async function createUser(req, res){
  console.log("***POST METHOD Creacion de Usuario");

  const doc = new modeloUser({

      nombreUser: req.body.username,
      correo: req.body.email,
      contraseña: req.body.password,
      contraseñaDos: req.body.confirm_password,
      // nombreUser: "User",
      // correo: "user@gmail.com",
      // contraseña: "user",
      imagen: "url",
      monedas: 0,
      victorias: 0,
      partidasJugadas: 0,
      productosComprados: 0,
      partidasEnJuego: 0
  });
  // const docs = await modeloUser.find(doc);
  // if (docs.length > 0) {
  //   //Existe el usuario
  //   res.status(400).json({message: 'Ya existe el usuario'});
  // }else{
    try {
        if(doc.contraseña == doc.contraseñaDos){        
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas");

            await doc.save();
            console.log('Documento guardado correctamente');
            res.status(201).json({message: 'Usuario creado correctamente'});
        }else{
            res.status(400).json({message: 'Contenido Invalido Passwords Distintas'});
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al crear usuario', nombreuser: req.body.username, correo: req.body.email, contraseña: req.body.password});
    }
  //}
}

async function deleteUser(req, res, next){
    console.log("***DELETE METHOD Eliminación de Usuario");
  const query = { nombreUser: req.body.username,  correo: req.body.email};
  const docs = await modeloUser.find(query);
  
  // if (docs.length == 0) {
  //   //Existe el usuario
  //   res.status(400).json({message: 'No existe el usuario'});
  // }else{ 
    const result = await modeloUser.deleteOne(query); 
    if (result.deletedCount === 1) {
      console.log("Se ha eliminado correctamenre");
      res.status(200).json({message: 'Usuario eliminado correctamente'})
    } else {
      console.log("No habia ningún usuario con esos datos.");
      res.status(400).json({error: 'Error al eliminar usuario Bad Request'});
    }
  //}
}

async function findUser(req, res, next){
    console.log("***GET METHOD Creacion de Usuario");

    req.params
    // const doc = new modeloUser({
    //     //nombre: req.params.nombre,
    //     //telefono: req.params.telefono
    //     nombre: req.body.nombre,
    //     telefono: req.body.telefono
    //     // telefono: req.body.telefono
    // });

    const doc = {nombre: req.body.nombre, telefono: req.body.telefono};

  
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        const docs = await modeloUser.find(doc);
      
        if (docs.length > 0) {
          console.log("Documento encontrado: ", docs);
          res.status(200).send('El usuario ha iniciado sesión correctamente');
        } else {
          console.log('No se encontró el documento');
          res.status(500).json({ error: 'Error el usuario no esta creado' });
        }
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error el usuario no esta creado' });
      }
      
}
module.exports = {createUser, deleteUser, findUser};
