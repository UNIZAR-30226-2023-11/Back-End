var config = require('../config/config');
var modeloPartida = require('../models/partidaModel')
const mongoose = require("mongoose");
const w = require('../winston')

var tablero = require('../controllers/tableroController');
const modeloTarjetas = require('../models/tarjetasModel');
const modeloTarjetasEnMano = require('../models/tarjetasEnMano');

var cartasController = require('../controllers/cartasController');
// var asignatura = require('../controllers/asignaturasController');

const casillaInicio = 10;

/**
 * 
 * @param {*} username Nombre del ususario que crea la partida.
 * @param {*} dineroInicial Dinero inicial con el que empezarán los jugadores la partida. 
 * @param {*} normas Todavia no esta introducido esta funcionalidad.
 * @param {*} nJugadores Numero de jugadores que jugarán
 * @param {*} return 0 si todo OK , o 2 si ocurre un error en la función
 */
async function crearPartida(username, dineroInicial, nJugadores, normas) {
    w.logger.info("***POST METHOD Crear partida");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas")

        const idMax = await modeloPartida.find().sort({ id: -1 }).limit(1).exec();
        const maxIdNumber = idMax[0].id;
        //console.log(maxIdNumber);
        const doc = new modeloPartida({
            id: maxIdNumber + 1,
            nombreJugadores: username,
            posicionJugadores: { h: casillaInicio, v: casillaInicio, julio: false },
            dineroJugadores: dineroInicial,
            numeroJugadores: nJugadores,
            dados: { dado1: 0, dado2: 0, jugador: "" }
            //normas:[]
        });
        await doc.save();
        w.logger.verbose('Documento guardado correctamente')
        var p = {
            id : doc.id,
            username: username
        }
        return p;

    } catch (error) {
        console.error(error);
        return 2;
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} idPartida Identificador de la partida
 * @param {*} res 
 */
//TODO: CAMBIAR A INFOPARTIDA
async function infoPartida(idPartida) {
    w.logger.info("***GET METHOD lista jugadores partida");
    try {

        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: idPartida }).exec();
        w.logger.debug("PARTIDA INFO PARTIDA" + JSON.stringify(partidaEncontrada));

        if (partidaEncontrada) {
            var lista = [];
            for (let i = 0; i < partidaEncontrada.nombreJugadores.length; i++) {
                lista.push([partidaEncontrada.nombreJugadores[i], partidaEncontrada.dineroJugadores[i]], partidaEncontrada.posicionJugadores[i]);
            }
            //w.logger.debug(lista);
            // var listas = {
            //     listaJugadores: partidaEncontrada.nombreJugadores,
            //     listaDineros: partidaEncontrada.dineroJugadores,
            //     listaPosiciones: partidaEncontrada.posicionJugadores,
            //     listaTuplas: lista
            // };
            //return listas;
            //TODO: Repasar si esta correcta
            return partidaEncontrada;

        } else {
            w.logger.debug("La partida no existe");
            return 1;
        }

    } catch (error) {
        w.logger.error(error);
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} idPartida Identificador de la partida
 * @param {*} nJugadores Numero de jugadores de la partida
 * @param {*} dineroInicial Dinero Inicial de los jugadores
 * @param {*} res 
 */
async function actualizarPartida(idPartida, nJugadores, dineroInicial, normas) {
   w.logger.info("***PUT METHOD Actualizar partida");
    try {

        await mongoose.connect(config.db.uri, config.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: idPartida }).exec();
        w.logger.debug(partidaEncontrada);

        if (partidaEncontrada) {
            //const tam = partidaEncontrada.nombreJugadores.length;
            for (let i = 0; i < partidaEncontrada.nombreJugadores.length; i++) {
                partidaEncontrada.dineroJugadores[i] = dineroInicial;
                console.log(partidaEncontrada.dineroJugadores[i]);

            }
            partidaEncontrada.numeroJugadores = nJugadores;
            //console.log(partidaEncontrada.numeroJugadores, req.body.nJugadores );

            //Actualizamos la partida
            const result = await modeloPartida.updateOne({ id: idPartida }, {
                $set: {
                    dineroJugadores: partidaEncontrada.dineroJugadores,
                    numeroJugadores: partidaEncontrada.numeroJugadores
                }
            })
            if (result.modifiedCount == 1) {
                w.logger.debug(result);
                w.logger.verbose("Se ha actualizado la partida correctamente");
                // res.status(200).json("Se ha actualizado la partida correctamente");
                return 0;
            } else {
                //console.error(error);
                w.logger.error(result);
                //res.status(205).json({ error: 'Error al actualizar la partida ' }); // es 205 porque puede ser que un jugador no haga nada en su turno
                return 1;
            }

        } else {
            w.logger.error("La partida no existe");
            return 1;
        }

    } catch (error) {
        w.logger.error(error);
        return 2;
        // res.status(500).json({ error: 'Error al actualizar partida' });
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

/**
 * Comprueba si un jugador esta ya en la partida
 * @param {*} username Nombre del jugador
 * @param {*} vJugadores Vector de los jugadores de la partida
 * @returns 
 */
function estaJugador(username, vJugadores) {
    return vJugadores.includes(username);
}

/**
 * @param {*} idPartida Identificador de la partida a la que desea unirse (el codigo).
 * @param {*} username Nombre del usuario que desea unirse a la partida. 
 * @param {*} res 
 */
async function unirJugador(idPartida, username) {
    w.logger.info("***PUT METHOD Actualizar partida se añaden jugadores");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions );
        w.logger.verbose("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: idPartida }).exec();
        w.logger.debug("Partida " + partidaEncontrada);

        if (partidaEncontrada) {
            if (!estaJugador(username, partidaEncontrada.nombreJugadores) 
            && partidaEncontrada.nombreJugadores.length < partidaEncontrada.numeroJugadores) {
                //Si no esta el jugador lo añadimos
                //Añadimos el jugador a nombreJugadores, posicionJugadores, y dineroJugadores
                const tam = partidaEncontrada.nombreJugadores.length;

                //Añadimos jugador a nombreJugadores
                partidaEncontrada.nombreJugadores[tam] = username;
                //Añadimos jugador a posicionJugadores, en este caso la inicial.
                partidaEncontrada.posicionJugadores[tam] = { h: casillaInicio, v: casillaInicio, julio: false };
                //Añadimos jugador a dineroJugadores, en este caso con el dinero inicial
                partidaEncontrada.dineroJugadores[tam] = partidaEncontrada.dineroJugadores[0];

                // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
                w.logger.debug("Partida " + partidaEncontrada);

                //Actualizamos la partida
                const result = await modeloPartida.updateOne({ id: idPartida }, {
                    $set: {
                        nombreJugadores: partidaEncontrada.nombreJugadores,
                        posicionJugadores: partidaEncontrada.posicionJugadores,
                        dineroJugadores: partidaEncontrada.dineroJugadores
                    }
                })
                if (result.modifiedCount == 1) {
                    w.logger.debug(result);
                    w.logger.verbose("Se ha actualizado la partida correctamente");
                    return 0;
                } else {
                    //console.error(error);
                    w.logger.error("NO SE HA MODIFICADO LA PARTIDA")
                
                    w.logger.debug(result);
                    return 1;
                }
            } else {
                //Ya esta el jugador no hay que hacer nada
                w.logger.verbose("El jugador ya esta en la partida o ya no se pueden unir más jugadores")
                return 4;
                //TODO: HAY QUE MIRAR QUE DEVOLVER
            }

        } else {
            w.logger.verbose("Partida no encontrada");
            return 1;
        }
    }
    catch (error) {
        w.logger.error(error);
        w.logger.verbose('Error al encontrar partida');
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

// async function comenzarPartida(req, res) {
//     console.log("***POST METHOD Comenzar partida");

// }

/**
 * 
 * @param {*} req.body.username Nombre del usuario que lanza los dados 
 * @param {*} req.body.idPartida
 * @param {*} res 
 */
async function lanzardados(idPartida, username) {
    w.logger.info("***POST METHOD Lanzar dados de la partida");

    w.logger.debug(idPartida);
    // Generate two random numbers between 1 and 6
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;

    // Calculate the total
    const total = dado1 + dado2;

    try {
        const partida = await findPartida(idPartida);
        w.logger.debug("PARTIDA ENCONTRADA");
        w.logger.debug(partida);
        if (partida != null) {
            await mongoose.connect(config.db.uri, config.db.dbOptions);
            w.logger.verbose("Connected to MongoDB Atlas");
            //Actualizamos la partida
            const posicion = partida.nombreJugadores.indexOf(username);
            const result = await modeloPartida.updateOne({ id: idPartida }, { $set: { "dados.dado1": dado1, "dados.dado2": dado2, "dados.jugador": username } })
            if (result.modifiedCount == 1) {
                
                w.logger.debug(result);
                w.logger.debug("Se ha actualizado la partida correctamente, se han añadido los dados y quien los ha lanzado");

                // Send the result as JSON
                w.logger.debug({
                    dado1: dado1,
                    dado2: dado2,
                    total: total
                });

                if (dado1 === dado2) { partida.dados.dobles ++; }
                
                if (estaJulio(username, idPartida)){
                    if (partida.dados.dobles === 3) {
                        partida.carcel[posicion] = false;
                        partida.dados.dobles = 0;

                        const resultado = await modeloPartida.updateOne({ id: idPartida }, { $set: { "dados.dobles": partida.dados.dobles, carcel: partida.carcel } })

                        if (resultado.modifiedCount != 1) {
                            w.logger.error('Error al actualizar posicion del jugador');
                            return 1;
                            // res.status(500).json({ error: 'Error al actualizar posicion del jugador' });
                            // exit(1);
                        }
                    }
                    var dado = { dado1, dado2, coordenadas: { h: 0, v:10 }, numDobles: partida.dados.dobles };
                } 
                if (!estaJulio(username, idPartida)) {
                    if (partida.dados.dobles === 3){
                        partida.carcel[posicion] = true;
                        partida.posicionJugadores[posicion].h = 0;
                        partida.posicionJugadores[posicion].v = 10;

                        const resultado = await modeloPartida.updateOne({ id: idPartida }, { $set: { posicionJugadores: partida.posicionJugadores, carcel: partida.carcel } })

                        if (resultado.modifiedCount != 1) {
                            w.logger.error('Error al actualizar posicion del jugador');
                            return 1;
                            // res.status(500).json({ error: 'Error al actualizar posicion del jugador' });
                            // exit(1);
                        }

                        var dado = { dado1, dado2, coordenadas: { h: 0, v:10 }, numDobles: partida.dados.dobles };

                    } else {
                        var avance = tablero.avanzar(partida.posicionJugadores[posicion], total);

                        partida.posicionJugadores[posicion] = avance.coordenadas;
                        const resultado = await modeloPartida.updateOne({ id: idPartida }, { $set: { posicionJugadores: partida.posicionJugadores } })

                        if (resultado.modifiedCount != 1) {
                            w.logger.error('Error al actualizar posicion del jugador');
                            return 1;
                            // res.status(500).json({ error: 'Error al actualizar posicion del jugador' });
                            // exit(1);
                        }
                        if (avance.salida) {
                            dar200(username, idPartida);
                            //TODO: hay que avisar que se ha cambiado el dinero
                        }
                        if(avance.julio){

                            partida.carcel[posicion] = true;
                            const resultado = await modeloPartida.updateOne({ id: idPartida }, { $set: { carcel: partida.carcel } })
                            if (resultado.modifiedCount != 1) {
                                w.logger.error('Error al actualizar carcel del jugador');
                                return 1;
                                // res.status(500).json({ error: 'Error al actualizar posicion del jugador' });
                                // exit(1);
                            }
                        }
                        var dado = { dado1, dado2, coordenadas: avance.coordenadas, numDobles: partida.dados.dobles };
                    }
                }
                // res.status(200).json(dado);
                return dado;
            } else {
                //console.error(error);
                console.low.logger.debug(result);
               return 1;
                // res.status(500).json({ error: 'Error al actualizar la partida al lanzar los dados ' });
            }
        } else {
            w.logger.debug("Partida no encontrada");
            // res.status(404).json({ error: 'No hay ninguna partida con ese id' });
            return 1;
        }
    } catch (error) {
        w.logger.error(error);
        w.logger.error('Error al lanzar los dados en la partida');
        return 2;
        // res.status(500).json({ error: 'Error al lanzar los dados en la partida' });
    }
}

async function findPartida(idPartida) {
    w.logger.info("*** METHOD Find partida");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: idPartida }).exec();
        w.logger.debug(idPartida);
        w.logger.debug(partidaEncontrada);

        if (partidaEncontrada) {
            // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
            //console.log(partidaEncontrada.nombreJugadores);
            //res.status(201).json({message: 'Partida encontrada correctamente', jugadores: partidaEncontrada.nombreJugadores});
            return partidaEncontrada;
            //res.send(partidaEncontrada);
        } else {
            w.logger.error("Partida no encontrada");
            //res.status(404).json({error: 'No hay ninguna partida con ese id'});
            return null;
        }
        //res.status(201).json({message: 'Partida creada correctamente'})
    }
    catch (error) {
        w.logger.error(error);
        w.logger.error('Error al encontrar partida');
        //res.status(500).json({error: 'Error al encontrar partida'});
        return null;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} req.body.idPartida 
 * @param {*} res 
 */
async function siguienteTurno(idPartida) {
    w.logger.info("FUNCION SIGUIENTE TURNO")
    const partida = await findPartida(idPartida);
    if (partida != null) {
        const tam = partida.nombreJugadores.length;
        if (partida.dados.jugador === "") {
            //le toca al primero
            partida.dados.jugador = partida.nombreJugadores[0];
            // res.status(200).json({ jugador: partida.nombreJugadores[0] });
            return {jugador: partida.nombreJugadores[0]}
        } else {
            const posicion = partida.nombreJugadores.indexOf(partida.dados.jugador);
            if (posicion == tam - 1) { //le vuelve a tocar al primero
                try {
                    partida.dados.jugador = partida.nombreJugadores[0];

                    await mongoose.connect(config.db.uri, config.db.dbOptions);
                    w.logger.verbose("Connected to MongoDB Atlas");
                    await modeloPartida.updateOne({ id: idPartida }, { $set: { "partida.dados.jugador": partida.dados.jugador, "partida.dados.dobles": 0 } });

                } catch (error) {
                    w.logger.error(error);
                    w.logger.error("Error al actualizar la partida al cambiar el jugador", partida.id);
                    return 2;
                } finally {
                    mongoose.disconnect();
                    w.logger.verbose("Disconnected to MongoDB Atlas")
                }

                // res.status(200).json({ jugador: partida.nombreJugadores[0], posicion: 0 });
                return { jugador: partida.nombreJugadores[0], posicion: 0 };
            } else {
                w.logger.debug("HOLAAA");

                try {
                    partida.dados.jugador = partida.nombreJugadores[posicion + 1];

                    await mongoose.connect(config.db.uri, config.db.dbOptions);
                    w.logger.verbose("Connected to MongoDB Atlas");
                    await modeloPartida.updateOne({ id: idPartida }, { $set: { "dados.jugador": partida.dados.jugador, "dados.dobles": 0 } });

                } catch (error) {
                    w.logger.error(error);
                    w.logger.error("Error al actualizar la partida al cambiar el jugador", partida.id);
                } finally {
                    mongoose.disconnect();
                    w.logger.verbose("Disconnected to MongoDB Atlas")
                }

                // res.status(200).json({ jugador: partida.nombreJugadores[posicion + 1], posicion: posicion + 1 });
                return { jugador: partida.nombreJugadores[posicion + 1], posicion: posicion + 1 };
            }
        }

    } else {
        // res.status(404).send("Partida no encontrada");
        return 1;
    }
}

/**
 * 
 * @param {*} req.body.idPartida 
 * @param {*} res 
 */
async function turnoActual(req, res) {

    const partida = await findPartida(req.body.idPartida, res);
    if (partida != null) {
        const posicion = partida.nombreJugadores.indexOf(partida.dados.jugador);
        if (partida.dados.jugador == "") {
            //le toca al primero
            res.status(200).json({ jugador: partida.nombreJugadores[0], posicion: 0 });
        } else {
            res.status(200).json({ jugador: partida.dados.jugador, posicion: posicion });
        }

    } else {
        res.status(404).send("Partida no encontrada");
    }
}

/**
 * 
 * @param {*} idPartida Partida de tipo modeloPartida
 * @param {*} username Usuario al que declaramos en bancarrota
 */
async function bancarrota(idPartida, username) {
    w.logger.verbose("***PUT METHOD Bancarrota de la partida");
    try {
        const partida = await findPartida(idPartida);
        const jugador = username;

        await mongoose.connect(config.db.uri, config.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores.splice(posicion, 1);
        partida.nombreJugadores.splice(posicion, 1);
        partida.posicionJugadores.splice(posicion, 1);
        await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores, nombreJugadores: partida.nombreJugadores, posicionJugadores: partida.posicionJugadores } });
        
        return 0; 
        res.status(200).json('Bancarrota');

    } catch (error) {
        w.logger.error(error);
        w.logger.error("Error al actualizar la partida al declararse en bancarrota", partida.id);
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} idPartida Partida de tipo modeloPartida
 * @param {*} username Usuario al que declaramos en bancarrota
 */
async function subastar(idPartida, asignatura) {
    w.logger.verbose("***PUT METHOD Subastar asignatura");
    try {
        const partida = await findPartida(idPartida);

        partida.subasta = []; // Reiniciar el vector a 0
        
        await mongoose.connect(config.db.uri, config.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");
        
    } catch (error) {
        w.logger.error(error);
        w.logger.error("Error al subastar la asignatura", asignatura);
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}


/**
 * 
 * @param {*} idPartida Partida de tipo modeloPartida
 * @param {*}  
 */
// Función que dado un idPartida devuelve el número de jugadores que pueden unirse a la partida
async function numJugadores(req, res) {
    console.log("***POST METHOD Número de jugadores de la partida");

    try {
        const partida = await findPartida(req.body.idPartida, res);
        if (partida != null) {
            res.status(200).json({ jugadores: partida.numeroJugadores });
        } else {
            res.status(404).send("Partida no encontrada");
        }
    } catch (error) {
        console.error(error);
        console.log("Error al obtener la lista de jugadores de la partida");
    }
}


/**
 * pagar Resta dinero al jugador
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} casilla Casilla de tipo modeloCasilla
 * @param {*} jugador Jugador que paga
 * @param {*} res 
 */
async function pagar(partida, dinero, jugador, bancarrota) {
    w.logger.verbose("FUNCION PRIVADA PAGAR");
    //console.log(partida);

    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] - dinero;

        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores } });

        if (result.modifiedCount == 1) {
            //console.log(result);
            w.logger.debug("Se ha actualizado la partida correctamente al pagar");

            if (partida.dineroJugadores[posicion] < 0) {
                console.log("Bancarrota ", bancarrota);
                // partida.dineroJugadores.splice(posicion, 1);
                // partida.nombreJugadores.splice(posicion, 1);
                // partida.posicionJugadores.splice(posicion, 1);
                bancarrota = true;
                partida.bancarrota[posicion] = bancarrota;
                w.logger.debug(partida);
                await modeloPartida.updateOne({ id: partida.id }, {
                    $set: {
                        bancarrota:  partida.bancarrota[posicion]
                    }
                });

            }

        }
        return bancarrota;
    } catch (error) {
        w.logger.error(error);
        w.logger.error("Error al actualizar la partida al pagar", partida.id);
        return 2;

    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}

/**
 * cobrar Añade dinero al jugador
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} casilla Casilla de tipo modeloCasilla
 * @param {*} jugador Jugador que cobra
 * @param {*} res 
 */
async function cobrar(partida, dinero, jugador) {
    w.logger.verbose("FUNCION PRIVADA COBRAR");
    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] + dinero;

        await mongoose.connect(config.db.uri, config.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores } });

        if (result.modifiedCount == 1) {
            //console.log(result);
            w.logger.debug("Se ha actualizado la partida correctamente al cobrar");
        } else {
            w.logger.error(error);
        }
    }
    catch (error) {
        w.logger.error(error);
        w.logger.error("Error al cobrar");
    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}


/**
 * 
 * @param {*} username Jugador que ha pasado por la casilla de salida
 * @param {*} idPartida Identificador del número de la partida 
 * @param {*} res 
 */
async function dar200(username, idPartida) {
    w.logger.verbose("METHOD Dar 200");
    const partida = await findPartida(idPartida);
    if (cobrar(partida, 200, username)) {
        return 0;
        // res.status(200).json({ message: 'Se le ha dado 200 euros al jugador ', jugador: req.body.username });
    } else {
        return 2;
        // res.status(500).json({ message: 'Ha ocurrido un error al cobrarle 200 euros ', jugador: req.body.username });
    }
}

/**
 * 
 * @param {*} username Jugador que ha pasado por la casilla de salida
 * @param {*} idPartida Identificador del número de la partida 
 */
async function estaJulio(username, idPartida) {
    w.logger.info("Comprabar si usuario está en julio")

    const partida = await findPartida(idPartida);
    const posicion = partida.nombreJugadores.indexOf(username);

    const carta = cartasController.cartaJulio(username, idPartida);

    const puedePagar = false;
    if (partida.dineroJugadores[posicion] >= 50){
        puedePagar = true;        
    }

    return { carcel: partida.carcel[posicion], carta: carta, salirJulio: puedePagar}
}

/**
 * 
 * @param {*} username Jugador que ha pasado por la casilla de salida
 * @param {*} idPartida Identificador del número de la partida 
 */
async function pagarJulio(username, idPartida) {
    w.logger.info("Jugador paga julio")

    const partida = await findPartida(idPartida);
    const posicion = partida.nombreJugadores.indexOf(username);

    await pagar(idPartida, 50, username, false);

    return 0;
}


module.exports = { crearPartida, unirJugador, lanzardados, findPartida, actualizarPartida, infoPartida, siguienteTurno, turnoActual, bancarrota, numJugadores, dar200, cobrar, pagar, estaJulio, pagarJulio};
