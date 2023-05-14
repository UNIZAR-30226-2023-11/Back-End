var config = require('../config/config');
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
const w = require('../winston');
const modeloAsignaturaComprada = require('../models/asignaturasCompradasModel');


/**
 * 
 * @param {*} idPartida Identificador de la partida
 * @param {*} coordenadas Coordenadas de la nueva posicion del jugador
 * @param {*} jugador Jugador que se ha movido
 */
async function actualizarPosicion(idPartida, coordenadas, jugador) {
    w.logger.info("ACTUALIZAR POSICION");
    const partida = await ctrlPartida.findPartida(idPartida);

    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.posicionJugadores[posicion].h = coordenadas.h;
        partida.posicionJugadores[posicion].v = coordenadas.v;

        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");
        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { posicionJugadores: partida.posicionJugadores } })

        if (result.modifiedCount == 1) {
            w.logger.debug("Se ha actualizado la partida correctamente al cambiar de posición");
        }

    } catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
    } finally {
         await mongoose.disconnect();
        w.logger.debug("Disconnected to MongoDB Atlas")
    }
}

/**
 * @param {*} coordenadas Coordenadas de la casilla donde ha caido el jugador 
 */
async function estaComprada(coordenadas, idPartida) {
    w.logger.info("CASILLA ESTA COMPRADA?");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas")

        const casillaComprada = await modeloAsignaturasComprada.findOne({ "partida": idPartida, "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();

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
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al saber si la casilla esta comprada o no');

    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas");
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloCasilla o null
 */
async function findCasilla(coordenadas) {
    w.logger.info("BUSCAR CASILLA");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");

        w.logger.verbose(`COORDENADAS FIN C ${JSON.stringify(coordenadas)}`);
        const casillaEncontrada = await modeloCasilla.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        w.logger.verbose(`Coordenadas: ${JSON.stringify(coordenadas)}`);

        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada");
            return null;
        }

    }
    catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al encontrar la casilla');
        return null;
    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloAsignatura o null
 */
async function isAsignatura(coordenadas) {
    w.logger.info("CASILLA ES ASIGNATURA");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloAsignatura.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();

        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada asignatura");
            return null;
        }
    }
    catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al encontrar la casilla asignatura');
        return null;
    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordinadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloFestividad o null
 */
async function isFestividad(coordenadas) {
    w.logger.info("CASILLA ES FESTIVIDAD");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloFestividad.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();

        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada festividad");
            return null;
        }
    } catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al encontrar la casilla asignatura');
        return null;
    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloImpuesto o null
 */
async function isImpuesto(coordenadas) {
    w.logger.info("CASILLA ES IMPUESTO");
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloImpuesto.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();

        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            w.logger.debug("Casilla no encontrada impuesto");
            return null;
        }
    } catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al encontrar la casilla impuesto');
        return null;

    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} username Nombre del jugador del que queremos la lista de asignaturas compradas
 * @param {*} idPartida Identificador de la partida
 * @returns Devuelve una casilla de tipo modeloCasilla o null
 */
async function findAsignaturasCompradas(username, idPartida) {
    w.logger.info("BUSCAR ASIGNATURAS COMPRADAS POR UN JUGADOR");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas")

        const casillas = await modeloAsignaturasComprada.find({ "partida": idPartida, "jugador": username }).exec();
        w.logger.verbose(`Casillas: ${JSON.stringify(casillas)}`);

        if (casillas != null) {
            w.logger.verbose(`Casillas: ${JSON.stringify(casillas)}`);
            return casillas;
        } else {
            w.logger.debug("El jugador no tiene casillas compradas");
            return null;
        }

    }
    catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al encontrar la casilla');
        return null;
    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} username Jugador que desea comprar la casilla
 * @param {*} coordenadas Corrdenadas de la casilla a comprar
 * @param {*} idPartida Identificador del número de la partida 
 */
async function comprarCasilla(username, coordenadas, idPartida) {
    w.logger.info("CASILLA COMPRADA POR UN JUGADOR");

    w.logger.verbose(`Coordenadas: ${JSON.stringify(coordenadas)}`);
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
                    doc.coordenadas = casillaCompradaI.coordenadas,
                        doc.partida = idPartida,
                        doc.jugador = username,
                        doc.precio = casillaCompradaI.matricula,
                        doc.nombre = casillaCompradaI.nombre;
                    doc.cuatrimestre = 9;
                }

                await mongoose.connect(config.db.uri, config.db.dbOptions);
                w.logger.debug("Connected to MongoDB Atlas")

                //La metemos en la tabla de casillas compradas
                try {

                    await doc.save();
                    w.logger.debug('Documento guardado correctamente');
                    let aumentar = await puedoAumentaroDisminuir(coordenadas, idPartida, username);

                    if (aumentar) {
                        return 6;
                    }
                    return 7;

                } catch (error) {
                    w.logger.error(`Error: ${JSON.stringify(error)}`);
                    if (pagado) {
                        await ctrlPartida.cobrar(partida, casilla.precioCompra, username);
                    }
                    return 2;

                } finally {
                     await mongoose.disconnect();
                    w.logger.debug("DisConnected to MongoDB Atlas")
                }
            } else {
                return 9;
            }

        } else {
            w.logger.error(`Error: ${JSON.stringify(error)}`);
            return 1;
        }

    } else {
        return 1;
    }

}

/**
 * 
 * @param {*} username Nombre de usuario del jugador.
 * @param {*} coordenadas Coordenadas de la casilla donde ha caido el jugador 
 * @param {*} idPartida 
 */
async function checkCasilla(username, coordenadas, idPartida) {
    w.logger.info("COMPROBAR CASILLA DE POSICION JUGADOR");

    //ACTUALIZAMOS LA POSICION DEL JUGADOR
    await actualizarPosicion(idPartida, coordenadas, username);
    var bancarrota = false;
    //Miramos si esta comprada
    const comprada = await estaComprada(coordenadas, idPartida);
    if (comprada != null) {
        const partida = await ctrlPartida.findPartida(idPartida);
        if (partida != null) {
            w.logger.verbose(`El jugador ${JSON.stringify(username)} esta en la casilla comprada tiene que pagar`);
            w.logger.verbose(`Comprada: ${JSON.stringify(comprada)}`);
            //Si la casilla esta comprada habrá que quitarle dinero al jugador y añadirselo al propietario
            //hay que comprobar que no esta comprada por el propio jugador
            if (comprada.jugador != username) {
                bancarrota = await ctrlPartida.pagar(partida, comprada.precio, username, bancarrota);
                await ctrlPartida.cobrar(partida, comprada.precio, comprada.jugador);
                return 5;

            } else {
                w.logger.verbose(`Esta casilla es mia: ${JSON.stringify(username)}, ${JSON.stringify(coordenadas)}`);
                let aumentar = await puedoAumentaroDisminuir(coordenadas, idPartida, username);
                if (aumentar) {
                    return 6;
                }
                return 7;
            }

        } else {
            w.logger.error(`Error: ${JSON.stringify(error)}`);
            w.logger.error('Error al actualizar la partida  al pagar la matricula');
            return 2;
        }


    } else {
        w.logger.verbose(`El jugador: ${JSON.stringify(username)}`);
        return 8;
    }
}

/**
 * 
 * @param {*} coordenadas Corrdenadas de la casilla a buscar información 
 */
async function infoAsignatura(coordenadas) {
    w.logger.verbose("DEVOLVER INFORMACIÓN ASIGNATURA");

    const casilla = await findCasilla(coordenadas);
    if (casilla != null) {
        //Existe la casilla
        var casillaInfo = null;
        if (casilla.tipo == "A") {
            casillaInfo = await isAsignatura(coordenadas);
        } else if (casilla.tipo == "F") {
            casillaInfo = await isFestividad(coordenadas);
            const image = await modeloImagen.findOne({nombre: casillaInfo.imagen}).exec();
        
            casillaInfo.imagen = image;
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
 */
async function listaAsignaturasC(username, idPartida) {
    w.logger.info("DEVOLVER EL LISTADO DE ASIGNATURAS DE UN JUGADOR");

    const casillas = await findAsignaturasCompradas(username, idPartida);
    if (casillas != null) {
        return casillas;
    } else {
        return 1;
    }
}

async function devolverCuatri(coordenadas) {
    w.logger.info("DEVOLVER CUATRIMESTRE DE UNA CASILLA");

    var casillas = await findCasilla(coordenadas);
    if (casillas != null) {
        w.logger.verbose(`Casillas: ${JSON.stringify(casillas)}`);
        return casillas.cuatrimestre;
    } else {
        w.logger.debug("El jugador no tiene casillas compradas");
        return 0;
    }

}

async function asignaturaInfo(coordenadas) {
    w.logger.verbose("DEVOLVER INFORMACION DE UNA CASILLA");

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
 */
async function aumentarCreditos(idPartida, username, coordenadas) {
    w.logger.info("AUMENTAR CREDITOS DE UNA ASIGNATURA");

    w.logger.verbose(`COOORDENADAS: ${JSON.stringify(coordenadas)}`);
    const cuatri = await devolverCuatri(coordenadas);
    w.logger.verbose(`CUATRI: ${JSON.stringify(cuatri)}`);
    let casillas = await findAsignaturasCompradas(username, idPartida);
    w.logger.verbose(`CASILLAS: ${JSON.stringify(casillas)}`);
    let casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].cuatrimestre === cuatri) {
            casillasFiltradas.push(casillas[i]);
        }
    }

    w.logger.verbose(`CASILLAS FILTRADAS: ${JSON.stringify(casillasFiltradas)}`);
    var todos = false;
    if ((cuatri == 1 || cuatri == 8) && (casillasFiltradas.length == 2)) {
        todos = true;
        w.logger.debug("HOLA 1");
    } else if ((cuatri != 1 || cuatri != 8) && (casillasFiltradas.length == 3)) {
        todos = true;
        w.logger.debug("HOLA 2");
    }

    if (todos == true) {
        w.logger.verbose(`COORDENADAS: ${JSON.stringify(coordenadas)}`);
        const asignatura = await asignaturaInfo(coordenadas);
        w.logger.verbose(`ASIGNATURA: ${JSON.stringify(asignatura)}`);
        w.logger.verbose(`ASIGNATURA 2: ${JSON.stringify(asignatura)}`);

        var pos = casillasFiltradas.findIndex(function (casilla) {
            return casilla.coordenadas.h === coordenadas.h && casilla.coordenadas.v === coordenadas.v;
        });

        let bancarrota = false;

        w.logger.verbose(`CASILLA A AUMENTAR: ${JSON.stringify(casillasFiltradas[pos])}`);
        w.logger.verbose(`CASILLA A AUMENTAR PRECIO: ${JSON.stringify(casillasFiltradas[pos].precio)}`);
        const partida = await ctrlPartida.findPartida(idPartida);
        if (casillasFiltradas[pos].precio == asignatura.matricula) {
            w.logger.verbose(`PRECIO: matricula-1C: ${JSON.stringify(asignatura.precio1C)}`);
            casillasFiltradas[pos].precio = asignatura.precio1C
            w.logger.verbose(`PRECIO: matricula-1C: ${JSON.stringify(casillasFiltradas[pos].precio)}`);
            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);
        }
        else if (casillasFiltradas[pos].precio == asignatura.precio1C) {
            w.logger.debug("PRECIO: 1C-2C");
            casillasFiltradas[pos].precio = asignatura.precio2C

            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio2C) {
            w.logger.debug("PRECIO: 2C-3C");
            casillasFiltradas[pos].precio = asignatura.precio3C
            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio3C) {
            w.logger.debug("PRECIO: 3C-4C");
            casillasFiltradas[pos].precio = asignatura.precio4C
            await ctrlPartida.pagar(partida, asignatura.precioCompraCreditos, username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio4C) {
            w.logger.debug("PRECIO: 4C-4C");
            // sin cambios
        }

        w.logger.verbose(`CasillasFiltradas: ${JSON.stringify(casillasFiltradas[pos])}`);

        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");
        try {
            const result = await modeloAsignaturasComprada.updateOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }, { $set: { precio: casillasFiltradas[pos].precio } })
            if (result.modifiedCount == 1) {
                w.logger.verbose(`Result: ${JSON.stringify(result)}`);
                w.logger.debug("Se ha actualizado la asignatura comprada correctamente");
                return 0;
            } else {
                w.logger.verbose(`Result: ${JSON.stringify(result)}`);
                return 1;
            }

        } catch (error) {
            w.logger.error(`Error: ${JSON.stringify(error)}`);
            w.logger.error('Error al aumentar creditos asignatura');
            return 2;

        } finally {
             await mongoose.disconnect();
            w.logger.verbose("DisConnected to MongoDB Atlas")
        }
    }
    else {
        return 2;
    }
}

/**
 * 
 * @param {*} idPartida
 * @param {*} username
 * @param {*} coordenadas
 */
async function disminuirCreditos(idPartida, username, coordenadas) {
    w.logger.info("DISMINUIR CREDITOS DE UNA ASIGNATURA");

    const asignatura_comprada = null;
    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.debug("Connected to MongoDB Atlas")

    try {
        asignatura_comprada = await modeloAsignaturaComprada.findOne({ coordenadas: coordenadas });

    } catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al disminuir creditos asignatura');
        return 2;

    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }

    const asignatura_info = await asignaturaInfo(coordenadas);

    w.logger.debug(`Asignatura comprada: ${JSON.stringify(asignatura_comprada)}`);
    w.logger.debug(`Asginatura info: ${JSON.stringify(asignatura_info)}`);

    if (asignatura_comprada.precio == asignatura_info.matricula) {
        w.logger.debug(`PRECIO: matricula-matricula ${JSON.stringify(asignatura_info.precio1C)}`);

        // sin cambios
    }
    else if (asignatura_comprada.precio == asignatura_info.precio1C) {
        w.logger.debug("PRECIO: 1C-matricula");
        asignatura_comprada.precio = asignatura_info.matricula;

        await ctrlPartida.devolverDinero(partida, asignatura_info.precioCompraCreditos, username, bancarrota);

    } else if (asignatura_comprada.precio == asignatura_info.precio2C) {
        w.logger.debug("PRECIO: 2C-1C");
        asignatura_comprada.precio = asignatura.precio1C

        await ctrlPartida.devolverDinero(partida, asignatura_info.precioCompraCreditos, username, bancarrota);

    } else if (asignatura_comprada.precio == asignatura_info.precio3C) {
        w.logger.debug("PRECIO: 3C-2C");
        asignatura_comprada.precio = asignatura_info.precio2C

        await ctrlPartida.devolverDinero(partida, asignatura_info.precioCompraCreditos, username, bancarrota);

    } else if (asignatura_comprada.precio == asignatura_info.precio4C) {
        w.logger.debug("PRECIO: 4C-3C");
        asignatura_comprada.precio = asignatura.precio3C

        await ctrlPartida.devolverDinero(partida, asignatura_info.precioCompraCreditos, username, bancarrota);
    }

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.debug("Connected to MongoDB Atlas")

    try {

        const result = await modeloAsignaturasComprada.updateOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }, { $set: { precio: asignatura_comprada.precio } })
        if (result.modifiedCount == 1) {
            w.logger.debug(`Result: ${JSON.stringify(result)}`);
            w.logger.debug("Se ha actualizado la asignatura comprada correctamente");
            return 0;
        } else {
            w.logger.debug(`Result: ${JSON.stringify(result)}`);
            return 1;
        }

    } catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error('Error al disminuir creditos asignatura');
        return 2;

    } finally {
         await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas")
    }
}

async function puedoAumentaroDisminuir(coordenadas, idPartida, username) {
    w.logger.info("COMPROBAR SI SE PUEDE AUMENTAR O DISMINUIR LOS CREDITOS DE UNA ASIGNATURA");
    // Comprobar que tiene todos los del mismo cuatrimestre
    // Aumentar creditos + 1 (cambiar precio en asignaturas_partida --> Comparar precio actual en info_asignaturas)
    // Devolver ok
    w.logger.verbose(`COOORDENADAS ${JSON.stringify(coordenadas)}`);
    const cuatri = await devolverCuatri(coordenadas);
    w.logger.verbose(`CUATRI: ${JSON.stringify(cuatri)}`);
    let casillas = await findAsignaturasCompradas(username, idPartida);
    w.logger.verbose(`CASILLAS: ${JSON.stringify(casillas)}`);
    let casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].cuatrimestre === cuatri) {
            casillasFiltradas.push(casillas[i]);
        }
    }

    w.logger.verbose(`CASILLAS FILTRADAS: ${JSON.stringify(casillasFiltradas)}`);
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
 * devolverDinero Suma dinero al jugador
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} casilla Casilla de tipo modeloCasilla
 * @param {*} jugador Jugador que paga
 */
async function devolverDinero(partida, dinero, jugador) {
    w.logger.info("DEVOLVER EL DINERO DE UN CREDITO A UN JUGADOR");


    const posicion = partida.nombreJugadores.indexOf(jugador);
    partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] + dinero;

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.debug("Connected to MongoDB Atlas");
    
    try {
        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores } });

        if (result.modifiedCount == 1) {
            w.logger.debug("Se ha actualizado la partida correctamente al pagar");

            // if (partida.dineroJugadores[posicion] < 0) {
            //     console.log("Bancarrota ", bancarrota);
            //     partida.dineroJugadores.splice(posicion, 1);
            //     partida.nombreJugadores.splice(posicion, 1);
            //     partida.posicionJugadores.splice(posicion, 1);
            //     bancarrota = true;
            //     w.logger.debug(partida);
            //     await modeloPartida.updateOne({ id: partida.id }, {
            //         $set: {
            //             dineroJugadores: partida.dineroJugadores, nombreJugadores: partida.nombreJugadores,
            //             posicionJugadores: partida.posicionJugadores
            //         }
            //     });

            // }

        }
        return true;

    } catch (error) {
        w.logger.error(`Error: ${JSON.stringify(error)}`);
        w.logger.error(`Error al actualizar la partida al pagar: ${JSON.stringify(partida.id)}`);
        return false;

    } finally {
         await mongoose.disconnect();
        w.logger.debug("Disconnected to MongoDB Atlas")
    }
}


/**
 * 
 * @param {*} idPartida
 * @param {*} username
 * @param {*} coordenadas 
 */
async function vender(idPartida, username, coordenadas) {
    w.logger.info("VENDER ASIGNATURA");

    //mirar que tine la asignatura
    let casillas = await findAsignaturasCompradas(username, idPartida);
    w.logger.verbose(`CASILLAS: ${JSON.stringify(casillas)}`);
    casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].coordenadas.h === coordenadas.h && casillas[i].coordenadas.v === coordenadas.v) {
            casillasFiltradas.push(casillas[i]);
        }
    }
    if (casillasFiltradas.length === 1) {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.debug("Connected to MongoDB Atlas");

        try {

            const result = await modeloAsignaturasComprada.deleteOne({
                "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v,
                partida: idPartida, jugador: username
            });
            if (result.deletedCount == 1) {
                w.logger.verbose(`Result: ${JSON.stringify(result)}`);
                w.logger.debug("Se ha vendido la asignatura correctamente ");

                const casilla = await asignaturaInfo(coordenadas);
                if (casilla) {
                    const partida = await ctrlPartida.findPartida(idPartida);
                    if (partida) {
                        await ctrlPartida.pagar(partida, casilla.devolucionMatricula, username);
                        return 0;
                    } else {
                        return 1;
                    }

                } else {
                    return 1;
                }

            } else {
                w.logger.error(`Error: ${JSON.stringify(result)}`);
                return 1;
            }


        } catch (error) {
            w.logger.error(`Error: ${JSON.stringify(error)}`);
            w.logger.error('Error al aumentar creditos asignatura');
            return 2;

        } finally {
             await mongoose.disconnect();
            w.logger.debug("DisConnected to MongoDB Atlas")
        }

    } else {
        return 1;
    }
}

module.exports = { checkCasilla, comprarCasilla, infoAsignatura, listaAsignaturasC, aumentarCreditos, vender };