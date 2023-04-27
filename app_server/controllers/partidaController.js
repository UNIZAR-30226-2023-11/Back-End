var config = require('../config/config');
var modeloPartida = require('../models/partidaModel')
const  mongoose = require("mongoose");

var tablero = require('../controllers/tableroController');


const casillaInicio = 10;

/**
 * 
 * @param {*} req.body.username Nombre del ususario que crea la partida.
 * @param {*} req.body.dineroInicial Dinero inicial con el que empezarán los jugadores la partida. 
 * @param {*} req.body.normas Todavia no esta introducido esta funcionalidad.
 * @param {*} req.body.nJugadores Numero de jugadores que jugarán
 * @param {*} res 
 */
async function crearPartida(req,res){
    console.log("***POST METHOD Crear partida");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        const idMax = await modeloPartida.find().sort({id: -1}).limit(1).exec();
        const maxIdNumber = idMax[0].id;
        //console.log(maxIdNumber);
        const doc = new modeloPartida ({
            id: maxIdNumber+1, 
            nombreJugadores: req.body.username,
            posicionJugadores: {h: casillaInicio, v: casillaInicio},
            dineroJugadores: req.body.dineroInicial,
            numeroJugadores: req.body.nJugadores,
            dados: {dado1: 0 , dado2: 0, jugador: ""}
            //normas:[]
        });
        await doc.save();
        console.log('Documento guardado correctamente')
        res.status(201).json({idPartida: doc.id});

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al crear partida',  nombreJugadores: req.body.username, posicionJugadores: 1010, dineroJugadores: 0});
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} req.body.idPartida Identificador de la partida
 * @param {*} res 
 */
async function listaJugadores(req,res){
    console.log("***GET METHOD lista jugadores partida");
    try {

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        
        const partidaEncontrada = await modeloPartida.findOne({id: req.body.idPartida}).exec();
        console.log(partidaEncontrada);

        if(partidaEncontrada){
            var lista= [];
            for(let i = 0; i < partidaEncontrada.nombreJugadores.length; i++) {
                lista.push([partidaEncontrada.nombreJugadores[i],partidaEncontrada.dineroJugadores[i]], partidaEncontrada.posicionJugadores[i]);
            }
            console.log(lista);
            res.status(200).json({
                listaJugadores: partidaEncontrada.nombreJugadores, 
                listaDineros: partidaEncontrada.dineroJugadores, 
                listaPosiciones: partidaEncontrada.posicionJugadores,
                listaTuplas: lista});

        }else{
            console.log("La partida no existe");
        }

    }catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener la lista de jugadores de la partida'});
    }finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} req.body.idPartida Identificador de la partida
 * @param {*} req.body.nJugadores Numero de jugadores de la partida
 * @param {*} req.body.dineroInicial Dinero Inicial de los jugadores
 * @param {*} res 
 */
async function actualizarPartida(req,res){
    console.log("***PUT METHOD Actualizar partida");
    try {

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        
        const partidaEncontrada = await modeloPartida.findOne({id: req.body.idPartida}).exec();
        console.log(partidaEncontrada);

        if(partidaEncontrada) {
            //const tam = partidaEncontrada.nombreJugadores.length;
            for(let i = 0; i < partidaEncontrada.nombreJugadores.length; i++) {
                partidaEncontrada.dineroJugadores[i] = req.body.dineroInicial;
                console.log(partidaEncontrada.dineroJugadores[i]);
            
            }
            partidaEncontrada.numeroJugadores = req.body.nJugadores;
            //console.log(partidaEncontrada.numeroJugadores, req.body.nJugadores );
            
            //Actualizamos la partida
            const result = await modeloPartida.updateOne({ id: req.body.idPartida},  { $set: { dineroJugadores: partidaEncontrada.dineroJugadores,
                                                                                               numeroJugadores: partidaEncontrada.numeroJugadores }})
            if(result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado la partida correctamente");
                res.status(200).json("Se ha actualizado la partida correctamente"); 
            } else {
                //console.error(error);
                console.log(result);
                res.status(500).json({ error: 'Error al actualizar la partida '});
            }

        } else {
            console.log("La partida no existe");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al actualizar partida'});
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * Comprueba si un jugador esta ya en la partida
 * @param {*} username Nombre del jugador
 * @param {*} vJugadores Vector de los jugadores de la partida
 * @returns 
 */
function estaJugador(username, vJugadores){
    return vJugadores.includes(username);
}

/**
 * @param {*} req.body.idPartida Identificador de la partida a la que desea unirse (el codigo).
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
                partidaEncontrada.posicionJugadores[tam] = {h: casillaInicio, v: casillaInicio};
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

/**
 * 
 * @param {*} req.body.username Nombre del usuario que lanza los dados 
 * @param {*} req.body.idPartida
 * @param {*} res 
 */
async function lanzardados(req,res){
    console.log("***POST METHOD Lanzar dados de la partida");
    // Generate two random numbers between 1 and 6
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;

    // Calculate the total
    const total = dado1 + dado2;

    try{
        const partida = await findPartida(req.body.idPartida, res);
        console.log("PARTIDA ENCONTRADA");
        console.log(partida);
        if(partida != null){
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas");
            //Actualizamos la partida
            const result = await modeloPartida.updateOne({ id: req.body.idPartida},  { $set:  { "dados.dado1": dado1, "dados.dado2": dado2, "dados.jugador": req.body.username }})
            if(result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado la partida correctamente, se han añadido los dados y quien los ha lanzado");
               
                // Send the result as JSON
                console.log({
                    dado1: dado1,
                    dado2: dado2,
                    total: total
                    });

                const posicion = partida.nombreJugadores.indexOf(req.body.username);
                var avance = tablero.avanzar(partida.posicionJugadores[posicion], 12);
                if(avance.salida){
                    //dar 200 euros
                }
                var dado = {dado1, dado2, coordenadas: avance.coordenadas};
                
                res.status(200).json(dado); 
            }else {
                //console.error(error);
                console.log(result);
                res.status(500).json({ error: 'Error al actualizar la partida al lanzar los dados '});
            }
        }else{
            console.log("Partida no encontrada");
            res.status(404).json({error: 'No hay ninguna partida con ese id'}); 
        }
    } catch (error) {
        console.error(error);
        console.log('Error al lanzar los dados en la partida');
        res.status(500).json({error: 'Error al lanzar los dados en la partida'});  
    }
}

async function findPartida(idPartida, res){
    console.log("*** METHOD Find partida");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        
        const partidaEncontrada = await modeloPartida.findOne({id: idPartida}).exec();
        console.log(idPartida);
        console.log(partidaEncontrada);

        if(partidaEncontrada ){
            // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
            //console.log(partidaEncontrada.nombreJugadores);
            //res.status(201).json({message: 'Partida encontrada correctamente', jugadores: partidaEncontrada.nombreJugadores});
            return partidaEncontrada;
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
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} req.body.idPartida 
 * @param {*} res 
 */
async function siguienteTurno(req, res){
    
    const partida = await findPartida(req.body.idPartida, res);
    if( partida != null){
        const tam = partida.nombreJugadores.length;
        if( partida.dados.jugador == ""){
            //le toca al primero
            partida.dados.jugador = partida.nombreJugadores[0];
            res.status(200).json({jugador: partida.nombreJugadores[0]});
        }else{
            const posicion = partida.nombreJugadores.indexOf(partida.dados.jugador);
            if(posicion == tam-1){ //le vuelve a tocar al primero
                partida.dados.jugador = partida.nombreJugadores[posicion];
                res.status(200).json({jugador: partida.nombreJugadores[0]});
            }else{
                partida.dados.jugador = partida.nombreJugadores[posicion+1];
                res.status(200).json({jugador: partida.nombreJugadores[posicion+1]});
            }
        }

    }else{
        res.status(404).send("Partida no encontrada");
    }
}

/**
 * 
 * @param {*} req.body.idPartida 
 * @param {*} res 
 */
async function turnoActual(req, res){
    
    const partida = await findPartida(req.body.idPartida, res);
    if( partida != null){
        const posicion = partida.nombreJugadores.indexOf(partida.dados.jugador);
        if( partida.dados.jugador == ""){
            //le toca al primero
            res.status(200).json({jugador: partida.nombreJugadores[0], posicion: 0});
        }else{
            res.status(200).json({jugador: partida.dados.jugador, posicion: posicion});
        }

    } else{
        res.status(404).send("Partida no encontrada");
    }
}

/**
 * 
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} jugador Jugador que se declara en bancarrota
 * @param {*}  
 */
async function bancarrota(partida, jugador,res){
    console.log("***PUT METHOD Bancarrota de la partida");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores.splice(posicion, 1);
        partida.nombreJugadores.splice(posicion, 1);
        partida.posicionJugadores.splice(posicion, 1);
        await modeloPartida.updateOne({ id: partida.id},  { $set: { dineroJugadores: partida.dineroJugadores, nombreJugadores: partida.nombreJugadores,
        posicionJugadores: partida.posicionJugadores}});
        res.status(200).json('Bancarrota');
    
    } catch (error) {
        console.error(error);
        console.log("Error al actualizar la partida al pagar", partida.id);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
    }
}

module.exports = {crearPartida, unirJugador, lanzardados, findPartida, actualizarPartida, listaJugadores, siguienteTurno, turnoActual, bancarrota};
