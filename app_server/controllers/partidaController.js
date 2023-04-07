var config = require('../config/config');
var modeloPartida = require('../models/partidaModel')
const  mongoose = require("mongoose");


const casillaInicio = 1010;

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

/**
 * 
 * @param {*} req.body.username Nombre del ususario que crea la partida.
 * @param {*} req.body.dineroInicial Dinero inicial con el que empezarán los jugadores la partida. 
 * @param {*} req.body.normas Todavia no esta introducido esta funcionalidad.
 * @param {*} res 
 */
async function crearPartida(req,res){
    console.log("***POST METHOD Crear partida");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        const idMax = await modeloPartida.find().sort({id: -1}).limit(1).exec();
        const maxIdNumber = idMax[0].id;
        console.log(maxIdNumber);
        const doc = new modeloPartida ({
            id: maxIdNumber+1, 
            nombreJugadores: req.body.username,
            posicionJugadores: casillaInicio,
            dineroJugadores: req.body.dineroInicial
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
        console.log("DisConnected to MongoDB Atlas")
    }
}


function estaJugador(username, vJugadores){
    return vJugadores.includes(username);
}

/**
 * @param {*} req.bodu.idPartida Identificador de la partida a la que desea unirse (el codigo).
 * @param {*} req.body.username Nombre del usuario que desea unirse a la partida. 
 * @param {*} res 
 */
async function unirJugador(req,res){
    console.log("***PUT METHOD Actualizar partida se añaden jugadores");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        
        const partidaEncontrada = await modeloPartida.findOne({id: req.body.idPartida}).exec();
        console.log(partidaEncontrada);
        
        if(partidaEncontrada ){
            if(!estaJugador(req.body.username, partidaEncontrada.nombreJugadores)){
                //Si no esta el jugador lo añadimos
                //Añadimos el jugador a nombreJugadores, posicionJugadores, y dineroJugadores
                const tam = partidaEncontrada.nombreJugadores.length;

                //Añadimos jugador a nombreJugadores
                partidaEncontrada.nombreJugadores[tam] = req.body.username;
                //Añadimos jugador a posicionJugadores, en este caso la inicial.
                partidaEncontrada.posicionJugadores[tam] = casillaInicio;
                //Añadimos jugador a dineroJugadores, en este caso con el dinero inicial
                partidaEncontrada.dineroJugadores[tam] =  partidaEncontrada.dineroJugadores[0];

                // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
                console.log(partidaEncontrada);
                
                //Actualizamos la partida
                const result = await modeloPartida.updateOne({ id: req.body.idPartida},  { $set: { nombreJugadores: partidaEncontrada.nombreJugadores,
                                                                                                posicionJugadores: partidaEncontrada.posicionJugadores,
                                                                                                dineroJugadores: partidaEncontrada.dineroJugadores }})
                if(result.modifiedCount == 1) {
                    console.log(result);
                    console.log("Se ha actualizado la partida correctamente");
                    res.status(200).json("Se ha actualizado la partida correctamente"); 
                }else {
                    //console.error(error);
                    console.log(result);
                    res.status(500).json({ error: 'Error al actualizar la partida '});
                }
            }else{
                //Ya esta el jugador no hay que hacer nada
                res.status(200).json("El jugador ya se ha unido"); 
            }

        } else {
            console.log("Partida no encontrada");
            res.status(404).json({error: 'No hay ninguna partida con ese id'}); 
        }
    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar partida');
        res.status(500).json({error: 'Error al encontrar partida'});
        
    }finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
    
}

async function comenzarPartida(req,res){
    console.log("***POST METHOD Comenzar partida");

}


// async function findPartida(idPartida){
//     console.log("*** METHOD Find partida");

//     try {
//         await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB Atlas");
        
//         const partidaEncontrada = await modeloPartida.findOne({id: idPartida}).exec();
//         console.log(idPartida);
//         console.log(partidaEncontrada);

//         if(partidaEncontrada ){
//             // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
//             console.log(partidaEncontrada.nombreJugadores);
//             return partidaEncontrada;
//             //res.status(201).json({message: 'Partida encontrada correctamente', jugadores: partidaEncontrada.nombreJugadores});
//             //res.send(partidaEncontrada);
//         } else {
//             console.log("Partida no encontrada");
//             //res.status(404).json({error: 'No hay ninguna partida con ese id'});
//             return null;
//         }
//         //res.status(201).json({message: 'Partida creada correctamente'})
//     }
//     catch (error) {
//         console.error(error);
//         console.log('Error al encontrar partida');
//         //res.status(500).json({error: 'Error al encontrar partida'});
//         return null;
//     }finally {
//         //mongoose.disconnect();
//     }
// }

module.exports = {crearPartida, unirJugador};
 