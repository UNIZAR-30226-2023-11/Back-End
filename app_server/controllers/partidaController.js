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
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        //const idMax =  modeloPartida.aggregate([{$group: {_id: null, maxId: {$max: "$id"}}}]).exec()
        const idMax = await modeloPartida.find().sort({id: -1}).limit(1).exec();
        const maxIdNumber = idMax[0].id;
        console.log(maxIdNumber);
        const doc = new modeloPartida ({
            id: maxIdNumber+1, 
            nombreJugadores: req.body.username,
            posicionJugadores: 1010,
            dineroJugadores: 0
            //normas:[]
        });
        await doc.save();
        console.log('Documento guardado correctamente')
        res.status(201).json({message: 'Partida creada correctamente'})

    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al crear partida',  nombreJugadores: req.body.username, posicionJugadores: 1010, dineroJugadores: 0});
    }finally {
        mongoose.disconnect();
    }
}

async function comenzarPartida(req,res){
    console.log("***POST METHOD Comenzar partida");

}


async function findPartida(idPartida){
    console.log("*** METHOD Find partida");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        console.log("ANTES DE FIND", idPartida);

        const partidaEncontrada = await modeloPartida.find({id: idPartida}).exec();
        console.log(idPartida);

        console.log(partidaEncontrada);
        if(partidaEncontrada){
            // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
            console.log(partidaEncontrada.nombreJugadores);
            return partidaEncontrada;
            //res.status(201).json({message: 'Partida encontrada correctamente', jugadores: partidaEncontrada.nombreJugadores});
            //res.send(partidaEncontrada);
        } else {
            console.log("Partida no encontrada");
            //res.status(404).json({error: 'No hay ninguna partida con ese id'});
            return null;
        }
        //res.status(201).json({message: 'Partida creada correctamente'})
    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar partida');
        //res.status(500).json({error: 'Error al encontrar partida'});
        return null;
    }finally {
        mongoose.disconnect();
    }
}

module.exports = {crearPartida, findPartida};
 