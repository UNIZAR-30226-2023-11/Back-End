var config = require('../config/config');
//var modeloUser = require('../models/userModel');
var modeloFestividad = require('../models/festividadModel');
var modeloAsignatura = require('../models/asignaturaModel');
var modeloPartida = require('../models/partidaModel');
var modeloTarjetas = require('../models/tarjetasModel');
var modeloAsignaturasComprada = require('../models/asignaturasCompradasModel');
var modeloCasilla = require('../models/casillaModel');
var modeloImpuesto = require('../models/impuestoModel');
var ctrlPartida = require('../controllers/partidaController');
const mongoose = require("mongoose");
const { rawListeners } = require('../models/normasModel');

const w = require('../winston')


//**FUNCIONES PRIVADAS  */

/**
 * 
 * @param {*} idPartida Identificador de la partida
 * @param {*} coordenadas Coordenadas de la nueva posicion del jugador
 * @param {*} jugador Jugador que se ha movido
 * @param {*} res 
 */
async function actualizarPosicion(idPartida, coordenadas, jugador) {
    w.logger.verbose("METHOD actualizarPosicion");
    const partida = await ctrlPartida.findPartida(idPartida);
    //console.log(partida);

    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.posicionJugadores[posicion].h = coordenadas.h;
        partida.posicionJugadores[posicion].v = coordenadas.v;

        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");
        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { posicionJugadores: partida.posicionJugadores } })

        if (result.modifiedCount == 1) {
            //console.log(result);
            w.logger.debug("Se ha actualizado la partida correctamente al cambiar de posición");
        }

    } catch (error) {
        w.logger.error(error);
    } finally {
        mongoose.disconnect();
        w.logger.verbose.log("Disconnected to MongoDB Atlas")
    }
}

/**
 * @param {*} coordenadas Coordenadas de la casilla donde ha caido el jugador 
 * @param {*} res 
 */
async function estaComprada(coordenadas, idPartida) {
    w.logger.verbose("***METHOD Para saber si esta comprada una casilla");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas")

        const casillaComprada = await modeloAsignaturasComprada.findOne({ "partida": idPartida, "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaComprada);

        if (casillaComprada != null) {
            //Esa casilla esa comprada
            w.logger.debug("La casilla esta comprada")
            return casillaComprada;
        } else {
            //Esa casilla no esta comprada
            w.logger.debug("La casilla no esta comprada")
            return null;
        }

    } catch (error) {
        w.logger.error(error);
        w.logger.error('Error al saber si la casilla esta comprada o no');

    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas");
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloCasilla o null
 */
async function findCasilla(coordenadas) {
    w.logger.verbose("*** METHOD Find casilla");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");
        w.logger.debug("COORDENADAS FIN C", coordenadas);
        const casillaEncontrada = await modeloCasilla.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        w.logger.debug(coordenadas);
        //console.log("casillaEncontrada");
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada");
            return null;
        }

    }
    catch (error) {
        w.logger.error(error);
        w.logger.error('Error al encontrar la casilla');
        return null;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloAsignatura o null
 */
async function isAsignatura(coordenadas) {
    w.logger.verbose("*** METHOD FIND asignatura");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloAsignatura.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada asignatura");
            return null;
        }
    }
    catch (error) {
        w.logger.error(error);
        w.logger.error('Error al encontrar la casilla asignatura');
        return null;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordinadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloFestividad o null
 */
async function isFestividad(coordenadas) {
    w.logger.verbose("*** METHOD FIND festividad");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloFestividad.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada festividad");
            return null;
        }
    } catch (error) {
        w.logger.error(error);
        w.logger.error('Error al encontrar la casilla asignatura');
        return null;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloImpuesto o null
 */
async function isImpuesto(coordenadas) {
    w.logger.verbose("*** METHOD FIND impuesto");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloImpuesto.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada impuesto");
            return null;
        }
    } catch (error) {
        w.logger.error(error);
        w.logger.error('Error al encontrar la casilla impuesto');
        return null;

    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}


/**
 * 
 * @param {*} username Nombre del jugador del que queremos la lista de asignaturas compradas
 * @param {*} idPartida Identificador de la partida
 * @returns Devuelve una casilla de tipo modeloCasilla o null
 */
async function findAsignaturasCompradas(username, idPartida) {
    w.logger.verbose("*** METHOD Find Asignaturas compradas");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas")

        const casillas = await modeloAsignaturasComprada.find({ "partida": idPartida, "jugador": username }).exec();
        w.logger.debug(casillas);
        //console.log(coordenadas);
        //console.log(casillaComprada);
        //console.log("casillaEncontrada");
        //console.log(casillaEncontrada);
        if (casillas != null) {
            w.logger.debug(casillas);
            return casillas;
        } else {
            w.logger.debug("El jugador no tiene casillas compradas");
            return null;
        }

    }
    catch (error) {
        w.logger.error(error);
        w.logger.error('Error al encontrar la casilla');
        return null;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}


//**FUNCIONES API  */


/**
 * 
 * @param {*} username Jugador que desea comprar la casilla
 * @param {*} coordenadas Corrdenadas de la casilla a comprar
 * @param {*} idPartida Identificador del número de la partida 
 * @param {*} res 
 */
async function comprarCasilla(username, coordenadas, idPartida) {
    w.logger.verbose("METHOD Comprar Casilla");
    w.logger.debug(coordenadas);
    const casilla = await findCasilla(coordenadas);
    var pagado = false;
    if (casilla != null) {
        //Existe la casilla
        const partida = await ctrlPartida.findPartida(idPartida);
        if (partida != null) {

            //miramos si tiene dinero para comprar
            const posicion = partida.nombreJugadores.indexOf(username);
            if (partida.dineroJugadores[posicion] >= casilla.precioCompra) {
                //Restamos el dinero al jugador y actualizamos el dinero en la partida
                await ctrlPartida.pagar(partida, casilla.precioCompra, username, false);
                pagado = true;
                //Miramos el tipo de casilla que es A,F,I,X
                const doc = new modeloAsignaturasComprada();
                if (casilla.tipo == "A") {
                    var casillaComprada = await isAsignatura(coordenadas);
                    doc.coordenadas = casillaComprada.coordenadas,
                        doc.partida = idPartida,
                        doc.jugador = username,
                        doc.precio = casillaComprada.matricula,
                        doc.cuatrimestre = casillaComprada.cuatrimestre;
                    doc.nombre = casillaComprada.nombre;
                } else if (casilla.tipo == "F") {
                    var casillaCompradaF = await isFestividad(coordenadas);
                    doc.coordenadas = casillaCompradaF.coordenadas,
                        doc.partida = idPartida,
                        doc.jugador = username,
                        doc.precio = casillaCompradaF.matricula,
                        doc.cuatrimestre = 0;
                    doc.nombre = casillaCompradaF.nombre;

                } else if (casilla.tipo == "I") {
                    var casillaCompradaI = await isImpuesto(coordenadas);
                    console.log(casillaCompradaI);

                    doc.coordenadas = casillaCompradaI.coordenadas,
                        doc.partida = idPartida,
                        doc.jugador = username,
                        doc.precio = casillaCompradaI.matricula,
                        doc.nombre = casillaCompradaI.nombre;
                    doc.cuatrimestre = 9;
                }
                console.log(doc);

                //La metemos en la tabla de casillas compradas
                try {
                    await mongoose.connect(config.db.uri, config.db.dbOptions);
                    console.log("Connected to MongoDB Atlas")

                    await doc.save();
                    console.log('Documento guardado correctamente');
                    let aumentar = await puedoAumentar(coordenadas, idPartida, username);

                    if (aumentar) {
                        return 6;
                    }
                    return 7;
                    //res.status(201).json({ message: 'Asignatura comprada insertada correctamente', aumento: aumentar });

                } catch (error) {
                    console.error(error);
                    if (pagado) {
                        await ctrlPartida.cobrar(partida, casilla.precioCompra, username);
                    }
                    return 2;
                    // res.status(500).json({ error: 'Error al comprar la casilla', nombreJugadores: username, posicionJugadores: 1010, dineroJugadores: 0 });
                } finally {
                    mongoose.disconnect();
                    w.logger.verbose("DisConnected to MongoDB Atlas")
                }
            } else {
                // res.status(400).json({ error: 'Error el usuario no tiene dinero suficiente para comprar la casilla' });
                return 9;
            }

        } else {
            w.logger.error(error);
            return 1;
            // res.status(500).json({ error: 'Error al actualizar la partida  al comprar una casilla' });
        }

    } else {
        res.status(404).json("La casilla no existe");
        return 1;
    }

}

/**
 * 
 * @param {*} username Nombre de usuario del jugador.
 * @param {*} coordenadas Coordenadas de la casilla donde ha caido el jugador 
 * @param {*} idPartida 
 * @param {*} res 
 */
async function checkCasilla(username, coordenadas, idPartida) {
    //ACTUALIZAMOS LA POSICION DEL JUGADOR
    await actualizarPosicion(idPartida, coordenadas, username);
    var bancarrota = false;
    //Miramos si esta compradacd
    const comprada = await estaComprada(coordenadas, idPartida);
    if (comprada != null) {
        const partida = await ctrlPartida.findPartida(idPartida);
        if (partida != null) {
            w.logger.debug("El jugador", username, "esta en la casilla comprada tiene que pagar");
            w.logger.debug(comprada);
            //Si la casilla esta comprada habrá que quitarle dinero al jugador y añadirselo al propietario
            //hay que comprobar que no esta comprada por el propio jugador
            if (comprada.jugador != username) {
                bancarrota = await ctrlPartida.pagar(partida, comprada.precio, username, bancarrota);
                await ctrlPartida.cobrar(partida, comprada.precio, comprada.jugador);
                // res.status(200).json({ message: 'Se ha pagado lo que se debia', jugador: comprada.jugador, dinero: comprada.precio, bancarrota: bancarrota });
                return 5;

            } else {
                w.logger.debug("Esta casilla es mia" + username + coordenadas);
                let aumentar = await puedoAumentar(coordenadas, idPartida, username);
                // res.status(200).json({ jugador: username, aumento: aumentar });
                if (aumentar) {
                    return 6;
                }
                return 7;
            }

        } else {
            w.logger.error(error);
            // res.status(500).json({ error: 'Error al actualizar la partida  al pagar la matricula' });
            w.logger.error('Error al actualizar la partida  al pagar la matricula');
            return 2;
        }


    } else {
        w.logger.debug("El jugador", username);
        //Puede Comprarla
        return 8;
        // res.status(200).json({ message: 'Esta asignatura se puede comprar', jugador: null, dinero: null });
    }
}






/**
 * 
 * @param {*} coordenadas Corrdenadas de la casilla a buscar información 
 * @param {*} res 
 */
async function infoAsignatura(coordenadas) {
    w.logger.verbose("METHOD INFO Casilla");
    //console.log(req.body.coordenadas);
    const casilla = await findCasilla(coordenadas);
    if (casilla != null) {

        //Existe la casilla
        var casillaInfo = null;
        if (casilla.tipo == "A") {
            casillaInfo = await isAsignatura(coordenadas);
        } else if (casilla.tipo == "F") {
            casillaInfo = await isFestividad(coordenadas);
        } else if (casilla.tipo == "I") {
            casillaInfo = await isImpuesto(coordenadas);
        }
        if (casillaInfo != null) {
            return casillaInfo;
        } else {
            return 1;
        }
    } else {
        return 1;
    }
}

/**
 * 
 * @param {*} idPartida Identificador de la partida  
 * @param {*} username Nombre del jugador del que queremos mirar las asignaturas compradas
 * @param {*} res 
 */
async function listaAsignaturasC(username, idPartida) {
    console.log("METHOD Comprar Casilla");
    //console.log(req.body.coordenadas);

    const casillas = await findAsignaturasCompradas(username, idPartida);
    if (casillas != null) {
        // res.status(200).json({ casillas });
        return casillas;
    } else {
        return 1;
        // res.status(404).json("El usuario no tiene casillas compradas");
    }
}

async function devolverCuatri(coordenadas) {
    w.logger.verbose("*** METHOD devolverCuatri");
    // try {
    //     await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
    //     console.log("Connected to MongoDB Atlas")

    //const casillas = await modeloCasilla.find({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
    //console.log(coordenadas);
    //console.log(casillaComprada);
    //console.log("casillaEncontrada");
    //console.log(casillaEncontrada);
    var casillas = await findCasilla(coordenadas);
    if (casillas != null) {
        w.logger.debug(casillas);
        return casillas.cuatrimestre;
    } else {
        w.logger.debug("El jugador no tiene casillas compradas");
        return 0;
    }

}
// catch (error) {
//     console.error(error);
//     console.log('Error al encontrar la casilla');
//     return 0;
// } finally {
//     mongoose.disconnect();
//     console.log("DisConnected to MongoDB Atlas")
// }
//}

async function asignaturaInfo(coordenadas) {
    w.logger.verbose("METHOD devolver info asignatura");
    //console.log(req.body.coordenadas);
    const casilla = await findCasilla(coordenadas);

    if (casilla) {

        //Existe la casilla
        if (casilla.tipo == "A") {
            var casillaInfo = new modeloAsignatura();
            casillaInfo = await isAsignatura(coordenadas);
            return casillaInfo;
        } else if (casilla.tipo == "F") {
            var casillaInfo = new modeloFestividad();
            casillaInfo = await isFestividad(coordenadas);
            return casillaInfo;
        } else if (casilla.tipo == "I") {
            var casillaInfo = new modeloImpuesto();
            casillaInfo = await isImpuesto(coordenadas);
            return casillaInfo;
        }
    }
    return null;
}

/**
 * 
 * @param {*} idPartida
 * @param {*} username
 * @param {*} coordenadas
 * @param {*} res 
 */
async function aumentarCreditos(idPartida, username, coordenadas) {
    w.logger.verbose("PUT Aumentar creditos asignatua");
    // Comprobar que tiene todos los del mismo cuatrimestre
    // Aumentar creditos + 1 (cambiar precio en asignaturas_partida --> Comparar precio actual en info_asignaturas)
    // Devolver ok
    w.logger.debug("COOORDENADAS" + coordenadas);
    const cuatri = await devolverCuatri(coordenadas);
    w.logger.debug("CUATRI" + cuatri);
    let casillas = await findAsignaturasCompradas(username, idPartida);
    w.logger.debug("CASILLAS " + casillas);
    let casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].cuatrimestre === cuatri) {
            casillasFiltradas.push(casillas[i]);
        }
    }

    w.logger.debug("CASILLAS FILTRADAS" + casillasFiltradas);
    var todos = false;
    if ((cuatri == 1 || cuatri == 8) && (casillasFiltradas.length == 2)) {
        todos = true;
        w.logger.debug("HOLA 1");
    } else if ((cuatri != 1 || cuatri != 8) && (casillasFiltradas.length == 3)) {
        todos = true;
        w.logger.debug("HOLA 2");
    }

    if (todos == true) {
        w.logger.debug("COORDENQDAS" + coordenadas);
        const asignatura = await asignaturaInfo(coordenadas);
        w.logger.debug("ASIGNATURA" + asignatura);
        w.logger.debug("ASIGNATURA 2" + asignatura);

        //var pos = casillasFiltradas.indexOf(req.body.coordenadas);
        var pos = casillasFiltradas.findIndex(function (casilla) {
            return casilla.coordenadas.h === coordenadas.h && casilla.coordenadas.v === coordenadas.v;
        });

        let bancarrota = false;

        w.logger.debug("CASILLA A AUMENTAR" + casillasFiltradas[pos]);
        w.logger.debug("CASILLA A AUMENTAR PRECIO" + casillasFiltradas[pos].precio);
        const partida = await ctrlPartida.findPartida(idPartida);
        if (casillasFiltradas[pos].precio == asignatura.matricula) {
            w.logger.debug("PRECIO: matricula-1C" + asignatura.precio1C);
            casillasFiltradas[pos].precio = asignatura.precio1C
            w.logger.debug("PRECIO: matricula-1C" + casillasFiltradas[pos].precio);
            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);
        }
        else if (casillasFiltradas[pos].precio == asignatura.precio1C) {
            w.logger.debug("PRECIO: 1C-2C");
            casillasFiltradas[pos].precio = asignatura.precio2C

            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio2C) {
            w.logger.debug("PRECIO: 2C-2C");
            casillasFiltradas[pos].precio = asignatura.precio3C
            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio3C) {
            w.logger.debug("PRECIO: 3C-3C");
            casillasFiltradas[pos].precio = asignatura.precio4C
            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio4C) {
            w.logger.debug("PRECIO: 4C-4C");
            // sin cambios
        }

        w.logger.debug(casillasFiltradas[pos]);

        try {
            await mongoose.connect(config.db.uri, config.db.dbOptions);
            w.logger.verbose("Connected to MongoDB Atlas");

            const result = await modeloAsignaturasComprada.updateOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }, { $set: { precio: casillasFiltradas[pos].precio } })
            if (result.modifiedCount == 1) {
                w.logger.debug(result);
                w.logger.debug("Se ha actualizado la asignatura comprada correctamente");
                return 0;
                // res.status(200).json("ok");
            } else {
                w.logger.debug(result);
                return 1;
                // res.status(500).json({ error: 'Error al actualizar la casilla comprada al aumentar creditos' });
            }

        } catch (error) {
            w.logger.error(error);
            w.logger.error('Error al aumentar creditos asignatura');
            return 2;
            // res.status(500).json({ error: 'Error al aumentar creditos asignatura' });

        } finally {
            mongoose.disconnect();
            w.logger.verbose("DisConnected to MongoDB Atlas")
        }
    }
    else {
        return 2;
        // res.status(500).json({ error: 'Error al aumentar creditos asignatura' });
    }
}


async function puedoAumentar(coordenadas, idPartida, username) {
    w.logger.verbose("PUT Puedo Aumentar creditos asignatua");
    // Comprobar que tiene todos los del mismo cuatrimestre
    // Aumentar creditos + 1 (cambiar precio en asignaturas_partida --> Comparar precio actual en info_asignaturas)
    // Devolver ok
    w.logger.debug("COOORDENADAS" + coordenadas);
    const cuatri = await devolverCuatri(coordenadas);
    w.logger.debug("CUATRI" + cuatri);
    let casillas = await findAsignaturasCompradas(username, idPartida);
    w.logger.debug("CASILLAS " + casillas);
    let casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].cuatrimestre === cuatri) {
            casillasFiltradas.push(casillas[i]);
        }
    }

    w.logger.debug("CASILLAS FILTRADAS" + casillasFiltradas);
    var todos = false;
    if ((cuatri == 1 || cuatri == 8) && (casillasFiltradas.length == 2)) {
        todos = true;
        w.logger.debug("HOLA 1");
    } else if ((cuatri != 1 || cuatri != 8) && (casillasFiltradas.length == 3)) {
        todos = true;
        w.logger.debug("HOLA 2");
    }
    return todos;
}

/**
 * 
 * @param {*} idPartida
 * @param {*} username
 * @param {*} coordenadas 
 * @param {*} res 
 */
async function vender(idPartida, username, coordenadas) {
    w.logger.verbose("METHOD Delete Vender Asignatura");

    // w.logger.debug(req.body);
    //mirar que tine la asignatura
    let casillas = await findAsignaturasCompradas(username, idPartida);
    w.logger.verbose("CASILLAS " + casillas);
    casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].coordenadas.h === coordenadas.h && casillas[i].coordenadas.v === coordenadas.v) {
            casillasFiltradas.push(casillas[i]);
        }
    }
    if (casillasFiltradas.length === 1) {
        try {
            await mongoose.connect(config.db.uri, config.db.dbOptions);
            console.log("Connected to MongoDB Atlas");
            //borrarla
            const result = await modeloAsignaturasComprada.deleteOne({
                "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v,
                partida: idPartida, jugador: username
            });
            if (result.deletedCount == 1) {
                w.logger.debug(result);
                w.logger.debug("Se ha vendido la asignatura correctamente ");
                //devolverle el dinero
                //buscar la asignatura
                //buscar la partida
                const casilla = await asignaturaInfo(coordenadas);
                if (casilla) {
                    const partida = await ctrlPartida.findPartida(idPartida);
                    if (partida) {
                        await ctrlPartida.pagar(partida, casilla.devolucionMatricula, username);
                        return 0;
                        // res.status(200).json("ok");
                    } else {
                        return 1;
                        // res.status(500).json({ error: 'Error al actualizar la venta de la casilla, no existe la partida' });
                    }

                } else {
                    return 1;
                    // res.status(500).json({ error: 'Error al actualizar la venta de la casilla, no existe la casilla' });
                }

            } else {
                w.logger.error(result);
                return 1;
                // res.status(500).json({ error: 'Error al actualizar la venta de la casilla' });
            }


        } catch (error) {
            w.logger.error(error);
            w.logger.error('Error al aumentar creditos asignatura');
            return 2;
            // res.status(500).json({ error: 'Error al aumentar creditos asignatura' });

        } finally {
            mongoose.disconnect();
            w.logger.verbose("DisConnected to MongoDB Atlas")
        }

    } else {
        return 1;
        //res.status(500).json({ error: 'Error al vender de la casilla, esa asignatura no es propiedad del usuario' });
    }
}

module.exports = { checkCasilla, comprarCasilla, infoAsignatura, listaAsignaturasC, aumentarCreditos, vender };
