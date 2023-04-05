var config = require('../config/config');
var modeloPartida = require('../models/partidaModel')
const  mongoose = require("mongoose");

async function procesarIdMax(idMax) {
    const doc = {
        id: idMax, 
        nombreJugadores: req.body.username,
        posicionJugadores: 1010,
        dineroJugadores: 0
    };

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        await doc.save();
        console.log('Documento guardado correctamente')
        res.status(201).json({message: 'Partida creada correctamente'})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al crear partida', id: idMax, nombreJugadores: req.body.username, posicionJugadores: 1010, dineroJugadores: 0});
    }finally {
        mongoose.disconnect();
    }
  }

async function crearPartida(req,res){
    console.log("***POST METHOD Crear partida");

    const idMax = await modeloPartida.aggregate([{$group: {_id: null, maxId: {$max: "$id"}}}])
    console.log(idMax)
    const doc = {
        id: idMax, 
        nombreJugadores: req.body.username,
        posicionJugadores: 1010,
        dineroJugadores: 0
    };

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        await doc.save();
        console.log('Documento guardado correctamente')
        res.status(201).json({message: 'Partida creada correctamente'})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al crear partida', id: idMax, nombreJugadores: req.body.username, posicionJugadores: 1010, dineroJugadores: 0});
    }finally {
        mongoose.disconnect();
    }
}

async function comenzarPartida(req,res){
    console.log("***POST METHOD Comenzar partida");

}

module.exports = {crearPartida};
 