var config = require('../config/config');
//var modeloUser = require('../models/userModel');
//var modeloFestividad = require('../models/festividadModel');
//var modeloAsignatura = require('../models/asignaturaModel');

var modeloPartida = require('../models/partidaModel');
var ctrlPartida = require('../controllers/partidaController');


const  mongoose = require("mongoose");



// async function isAsignatura(coord, nombreUsr){
//     try {
//         await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB Atlas")

//         const doc = {coordenadas: coord};
//         const result = await modeloAsignatura.find(doc).exec();;

//         if (result.lenght == 0){
//             return 0;
//         }else if(result.lenght == 1){
//             console.log(result[0].nombre);

//             res.status(200).json({message: 'Asignatura Encontrada'})
//             return 1;
//         }
//     }
//     catch (error) {
//         console.error(error);
//         //res.status(500).json({error: 'Error al encontrar Asignatura'});
//         return 0;
//     }finally {
//         mongoose.disconnect();
//     }
// }

// async function isFestividad(coord){
//     try {
//         await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB Atlas")

//         const doc = {coordenadas: coord, tipo: "Festividad"};
//         const result = await modeloFestividad.find(doc).exec();;

//         if (result.lenght == 0){
//             return 0;
//         }else if(result.lenght == 1){
//             console.log(result[0].nombre)
//             res.status(200).json({message: 'Festividad Encontrada'})
//             return 1;
//         }
//     }
//     catch (error) {
//         console.error(error);
//         //res.status(500).json({error: 'Error al encontrar Asignatura'});
//         return 0;
//     }finally {
//         mongoose.disconnect();
//     }
// }

// async function isPago(idP, coord, nombreUsr){
//     try {
//         await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB Atlas")

//         const doc = {coordenadas: coord, tipo: "Pago"};
//         const result = await modeloPago.find(doc).exec();;

//         if (result.lenght == 0){
//             return 0;
//         }else if(result.lenght == 1){
//             console.log(result[0].nombre);
//             console.log(result[0].pago);

//             //Es una casilla de pago
//             //Obtenemos el dinero 
//             //Buscamos al usuario dentro de la partida
//             //Actualizamos su dinero (-)
//             res.status(200).json({message: 'Pago Encontrada'})
//             return 1;
//         }
//     }
//     catch (error) {
//         console.error(error);
//         //res.status(500).json({error: 'Error al encontrar Asignatura'});
//         return 0;
//     }finally {
//         mongoose.disconnect();
//     }
// }

// async function isCobro(coord){
//     try {
//         await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
//         console.log("Connected to MongoDB Atlas")

//         const doc = {coordenadas: coord, tipo: "Cobro"};
//         const result = await modeloPago.find(doc).exec();;

//         if (result.lenght == 0){
//             return 0;
//         }else if(result.lenght == 1){
//             console.log(result[0].nombre);
//             console.log(result[0].cobro);

//             //Es una casilla de cobro
//             //Obtenemos el dinero 
//             //Buscamos al usuario
//             //Actualizamos su dinero (+)
//             res.status(200).json({message: 'Cobro Encontrado'})
//             return 1;
//         }
//     }
//     catch (error) {
//         console.error(error);
//         //res.status(500).json({error: 'Error al encontrar Asignatura'});
//         return 0;
//     }finally {
//         mongoose.disconnect();
//     }
// }

async function checkCasilla(req, res){
    //info asignatura son casillas
    console.log("***METHOD Para chequear casilla ");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        var partidaEncontrada = ctrlPartida.findPartida(req.body.idPartida);
        
        if(partidaEncontrada!= null){
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas")

            const posicion = partidaEncontrada.nombreJugadores.indexOf(req.body.username);
            partidaEncontrada.dineroJugadores[posicion] = partidaEncontrada.dineroJugadores[posicion] + 100;

            const result = await modeloPartida.updateOne({ id: req.body.idPartida},  { $set: { dineroJugadores: partidaEncontrada.dineroJugadores }})
            
            if(result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado la partida correctamente");
                res.status(200).json("Se ha actualizado la partida correctamente"); 
            }else {
                //console.error(error);
                console.log(result);
                //TODO:Probar que si se quita este lo coge el otro
                res.status(500).json({ error: 'Error al actualizar la partida '});
            }
        }else{
            console.log("Partida Encontrada null");

        }
        
        
        //me pasan las coordenadas
        //miro que es
        // await modeloUser.find();
        // console.log('Usuario leido correctamente')
        // res.status(200).json({message: 'Usuario creado correctamente'})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al checkCasilla'});
    }finally {
        mongoose.disconnect();
    }

}

module.exports = {checkCasilla};
