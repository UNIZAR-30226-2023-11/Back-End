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



//**FUNCIONES PRIVADAS  */
/**
 * pagar Resta dinero al jugador
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} casilla Casilla de tipo modeloCasilla
 * @param {*} jugador Jugador que paga
 * @param {*} res 
 */
async function pagar(partida, dinero, jugador, bancarrota) {
    console.log("FUNCION PRIVADA PAGAR");
    //console.log(partida);

    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] - dinero;

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores } });

        if (result.modifiedCount == 1) {
            //console.log(result);
            console.log("Se ha actualizado la partida correctamente al pagar");

            if (partida.dineroJugadores[posicion] < 0) {
                console.log("Bancarrota ", bancarrota);
                partida.dineroJugadores.splice(posicion, 1);
                partida.nombreJugadores.splice(posicion, 1);
                partida.posicionJugadores.splice(posicion, 1);
                bancarrota = true;
                console.log(partida);
                await modeloPartida.updateOne({ id: partida.id }, {
                    $set: {
                        dineroJugadores: partida.dineroJugadores, nombreJugadores: partida.nombreJugadores,
                        posicionJugadores: partida.posicionJugadores
                    }
                });

            }

        }
        return bancarrota;
    } catch (error) {
        console.error(error);
        console.log("Error al actualizar la partida al pagar", partida.id);
        return bancarrota;

    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
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
    console.log("FUNCION PRIVADA COBRAR");
    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] + dinero;

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores } });

        if (result.modifiedCount == 1) {
            //console.log(result);
            console.log("Se ha actualizado la partida correctamente al cobrar");
        } else {
            console.error(error);
        }
    }
    catch (error) {
        console.error(error);
        console.log("Error al cobrar");
    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} idPartida Identificador de la partida
 * @param {*} coordenadas Coordenadas de la nueva posicion del jugador
 * @param {*} jugador Jugador que se ha movido
 * @param {*} res 
 */
async function actualizarPosicion(idPartida, coordenadas, jugador, res) {
    console.log("METHOD actualizarPosicion");
    const partida = await ctrlPartida.findPartida(idPartida);
    //console.log(partida);

    try {
        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.posicionJugadores[posicion].h = coordenadas.h;
        partida.posicionJugadores[posicion].v = coordenadas.v;

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const result = await modeloPartida.updateOne({ id: partida.id }, { $set: { posicionJugadores: partida.posicionJugadores } })

        if (result.modifiedCount == 1) {
            //console.log(result);
            console.log("Se ha actualizado la partida correctamente al cambiar de posición");
            //res.status(200).json("Se ha actualizado correctamente al cambiar de posición"); 
        }

    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Error al actualizar la partida al cambiar la posicion'});

    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
    }
}

/**
 * @param {*} coordenadas Coordenadas de la casilla donde ha caido el jugador 
 * @param {*} res 
 */
async function estaComprada(coordenadas, idPartida) {
    console.log("***METHOD Para saber si esta comprada una casilla");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        const casillaComprada = await modeloAsignaturasComprada.findOne({ "partida": idPartida, "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaComprada);

        if (casillaComprada != null) {
            //Esa casilla esa comprada
            //res.status(200).json("La casilla esta comprada");
            console.log("La casilla esta comprada")
            return casillaComprada;
        } else {
            //Esa casilla no esta comprada
            //res.status(200).json("La casilla no esta comprada"); 
            console.log("La casilla no esta comprada")
            return null;
        }

    } catch (error) {
        console.log(error);
        console.log('Error al saber si la casilla esta comprada o no');

        //res.status(500).json({mensaje: 'Error al saber si la casilla esta comprada o no'});
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas");
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloCasilla o null
 */
async function findCasilla(coordenadas) {
    console.log("*** METHOD Find casilla");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        console.log("COORDENADAS FIN C", coordenadas);
        const casillaEncontrada = await modeloCasilla.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        console.log(coordenadas);
        //console.log("casillaEncontrada");
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            console.log("Casilla no encontrada");
            return null;
        }

    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar la casilla');
        return null;
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloAsignatura o null
 */
async function isAsignatura(coordenadas) {
    console.log("*** METHOD FIND asignatura");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloAsignatura.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            console.log("Casilla no encontrada asignatura");
            return null;
        }
    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar la casilla asignatura');
        return null;
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordinadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloFestividad o null
 */
async function isFestividad(coordenadas) {
    console.log("*** METHOD FIND festividad");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloFestividad.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            console.log("Casilla no encontrada festividad");
            return null;
        }
    } catch (error) {
        console.error(error);
        console.log('Error al encontrar la casilla asignatura');
        return null;
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} coordenadas Coordenadas de la casilla a buscar
 * @returns Devuelve una casilla de tipo modeloImpuesto o null
 */
async function isImpuesto(coordenadas) {
    console.log("*** METHOD FIND impuesto");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const casillaEncontrada = await modeloImpuesto.findOne({ "coordenadas.h": coordenadas.h, "coordenadas.v": coordenadas.v }).exec();
        //console.log(coordenadas);
        //console.log(casillaEncontrada);
        if (casillaEncontrada) {
            return casillaEncontrada;
        } else {
            console.log("Casilla no encontrada impuesto");
            return null;
        }
    } catch (error) {
        console.error(error);
        console.log('Error al encontrar la casilla impuesto');
        return null;

    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}


/**
 * 
 * @param {*} username Nombre del jugador del que queremos la lista de asignaturas compradas
 * @param {*} idPartida Identificador de la partida
 * @returns Devuelve una casilla de tipo modeloCasilla o null
 */
async function findAsignaturasCompradas(username, idPartida) {
    console.log("*** METHOD Find Asignaturas compradas");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        const casillas = await modeloAsignaturasComprada.find({ "partida": idPartida, "jugador": username }).exec();
        console.log(casillas);
        //console.log(coordenadas);
        //console.log(casillaComprada);
        //console.log("casillaEncontrada");
        //console.log(casillaEncontrada);
        if (casillas != null) {
            console.log(casillas);
            return casillas;
        } else {
            console.log("El jugador no tiene casillas compradas");
            return null;
        }

    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar la casilla');
        return null;
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}


//**FUNCIONES API  */


/**
 * 
 * @param {*} req.body.username Jugador que desea comprar la casilla
 * @param {*} req.body.coordenadas Corrdenadas de la casilla a comprar
 * @param {*} req.body.idPartida Identificador del número de la partida 
 * @param {*} res 
 */
async function comprarCasilla(req, res) {
    console.log("METHOD Comprar Casilla");
    console.log(req.body.coordenadas);
    const casilla = await findCasilla(req.body.coordenadas);
    if (casilla != null) {
        //Existe la casilla
        const partida = await ctrlPartida.findPartida(req.body.idPartida, res);
        if (partida != null) {

            //miramos si tiene dinero para comprar
            const posicion = partida.nombreJugadores.indexOf(req.body.username);
            if (partida.dineroJugadores[posicion] >= casilla.precioCompra) {
                //Restamos el dinero al jugador y actualizamos el dinero en la partida
                await pagar(partida, casilla.precioCompra, req.body.username, false);
                //Miramos el tipo de casilla que es A,F,I,X
                const doc = new modeloAsignaturasComprada();
                if (casilla.tipo == "A") {
                    var casillaComprada = await isAsignatura(req.body.coordenadas);
                    doc.coordenadas = casillaComprada.coordenadas,
                        doc.partida = req.body.idPartida,
                        doc.jugador = req.body.username,
                        doc.precio = casillaComprada.matricula,
                        doc.cuatrimestre = casillaComprada.cuatrimestre;
                    doc.nombre = casillaComprada.nombre;
                } else if (casilla.tipo == "F") {
                    var casillaCompradaF = await isFestividad(req.body.coordenadas);
                    doc.coordenadas = casillaCompradaF.coordenadas,
                        doc.partida = req.body.idPartida,
                        doc.jugador = req.body.username,
                        doc.precio = casillaCompradaF.matricula,
                        doc.cuatrimestre = 0;
                    doc.nombre = casillaCompradaF.nombre;

                } else if (casilla.tipo == "I") {
                    var casillaCompradaI = await isImpuesto(req.body.coordenadas);
                    console.log(casillaCompradaI);

                    doc.coordenadas = casillaCompradaI.coordenadas,
                        doc.partida = req.body.idPartida,
                        doc.jugador = req.body.username,
                        doc.precio = casillaCompradaI.matricula,
                        doc.nombre = casillaCompradaI.nombre;
                    doc.cuatrimestre = 9;
                }
                console.log(doc);

                //La metemos en la tabla de casillas compradas
                try {
                    await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    console.log("Connected to MongoDB Atlas")

                    await doc.save();
                    console.log('Documento guardado correctamente');
                    let aumentar = await puedoAumentar(req.body.coordenadas, req.body.idPartida, req.body.username);
                    res.status(201).json({ message: 'Asignatura comprada insertada correctamente', aumento: aumentar });

                } catch (error) {
                    console.error(error);
                    await cobrar(partida, casilla.precioCompra, req.body.username, res);
                    res.status(500).json({ error: 'Error al comprar la casilla', nombreJugadores: req.body.username, posicionJugadores: 1010, dineroJugadores: 0 });
                } finally {
                    mongoose.disconnect();
                    console.log("DisConnected to MongoDB Atlas")
                }
            } else {
                res.status(400).json({ error: 'Error el usuario no tiene dinero suficiente para comprar la casilla' });
            }

        } else {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la partida  al comprar una casilla' });
        }

    } else {
        res.status(404).json("La casilla no existe");
    }

}

/**
 * 
 * @param {*} req.body.username Nombre de usuario del jugador.
 * @param {*} req.body.coordenadas Coordenadas de la casilla donde ha caido el jugador 
 * @param {*} req.body.idPartida 
 * @param {*} res 
 */
async function checkCasilla(req, res) {
    //ACTUALIZAMOS LA POSICION DEL JUGADOR
    await actualizarPosicion(req.body.idPartida, req.body.coordenadas, req.body.username, res);
    var bancarrota = false;
    //Miramos si esta compradacd
    const comprada = await estaComprada(req.body.coordenadas, req.body.idPartida);
    if (comprada != null) {
        const partida = await ctrlPartida.findPartida(req.body.idPartida, res);
        if (partida != null) {
            console.log("El jugador", req.body.username, "esta en la casilla comprada tiene que pagar");
            console.log(comprada);
            //Si la casilla esta comprada habrá que quitarle dinero al jugador y añadirselo al propietario
            //hay que comprobar que no esta comprada por el propio jugador
            if (comprada.jugador != req.body.username) {
                bancarrota = await pagar(partida, comprada.precio, req.body.username, bancarrota);
                await cobrar(partida, comprada.precio, comprada.jugador, res);
                res.status(200).json({ message: 'Se ha pagado lo que se debia', jugador: comprada.jugador, dinero: comprada.precio, bancarrota: bancarrota });
            } else {
                console.log("Esta casilla es mia", req.body.username, req.body.coordenadas);
                let aumentar = await puedoAumentar(req.body.coordenadas, req.body.idPartida, req.body.username);
                res.status(200).json({ jugador: req.body.username, aumento: aumentar });
            }

        } else {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar la partida  al pagar la matricula' });
            console.log('Error al actualizar la partida  al pagar la matricula');
        }


    } else {
        console.log("El jugador", req.body.username);
        //Puede Comprarla

        res.status(200).json({ message: 'Esta asignatura se puede comprar', jugador: null, dinero: null });
    }
}






/**
 * 
 * @param {*} coordenadas Corrdenadas de la casilla a buscar información 
 * @param {*} res 
 */
async function infoAsignatura(coordenadas) {
    console.log("METHOD Comprar Casilla");
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
            // res.status(200).json({ casillaInfo });
            return casillaInfo;
        } else {
            // res.status(404).json("No se ha encontrado la indormación de la casilla");
            return 1;
        }


    } else {
        // res.status(404).json("La casilla no existe");
        return 1;
    }
}

/**
 * 
 * @param {*} req.body.idPartida Identificador de la partida  
 * @param {*} req.body.username Nombre del jugador del que queremos mirar las asignaturas compradas
 * @param {*} res 
 */
async function listaAsignaturasC(req, res) {
    console.log("METHOD Comprar Casilla");
    //console.log(req.body.coordenadas);

    const casillas = await findAsignaturasCompradas(req.body.username, req.body.idPartida);
    if (casillas != null) {
        res.status(200).json({ casillas });
    } else {
        res.status(404).json("El usuario no tiene casillas compradas");
    }
}

async function devolverCuatri(coordenadas) {
    console.log("*** METHOD devolverCuatri");
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
        console.log(casillas);
        return casillas.cuatrimestre;
    } else {
        console.log("El jugador no tiene casillas compradas");
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
    console.log("METHOD devolver info asignatura");
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
 * @param {*} req.body.idPartida
 * @param {*} req.body.username
 * @param {*} req.body.coordenadas
 * @param {*} res 
 */
async function aumentarCreditos(req, res) {
    console.log("PUT Aumentar creditos asignatua");
    // Comprobar que tiene todos los del mismo cuatrimestre
    // Aumentar creditos + 1 (cambiar precio en asignaturas_partida --> Comparar precio actual en info_asignaturas)
    // Devolver ok
    console.log("COOORDENADAS", req.body.coordenadas);
    const cuatri = await devolverCuatri(req.body.coordenadas);
    console.log("CUATRI", cuatri);
    let casillas = await findAsignaturasCompradas(req.body.username, req.body.idPartida);
    console.log("CASILLAS ", casillas);
    let casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].cuatrimestre === cuatri) {
            casillasFiltradas.push(casillas[i]);
        }
    }

    console.log("CASILLAS FILTRADAS", casillasFiltradas);
    var todos = false;

    if ((cuatri == 1 || cuatri == 8) && (casillasFiltradas.length == 2)) {
        todos = true;
        console.log("HOLA 1");
    } else if ((cuatri != 1 || cuatri != 8) && (casillasFiltradas.length == 3)) {
        todos = true;
        console.log("HOLA 2");
    }

    if (todos == true) {
        console.log("COORDENQDAS", req.body.coordenadas);
        const asignatura = await asignaturaInfo(req.body.coordenadas);
        console.log("ASIGNATURA", asignatura);
        console.log("ASIGNATURA 2", asignatura);

        //var pos = casillasFiltradas.indexOf(req.body.coordenadas);
        var pos = casillasFiltradas.findIndex(function (casilla) {
            return casilla.coordenadas.h === req.body.coordenadas.h && casilla.coordenadas.v === req.body.coordenadas.v;
        });

        let bancarrota = false;

        console.log("CASILLA A AUMENTAR", casillasFiltradas[pos]);
        console.log("CASILLA A AUMENTAR PRECIO", casillasFiltradas[pos].precio);
        const partida = await ctrlPartida.findPartida(req.body.idPartida, res);
        if (casillasFiltradas[pos].precio == asignatura.matricula) {
            console.log("PRECIO: matricula-1C", asignatura.precio1C);
            casillasFiltradas[pos].precio = asignatura.precio1C
            console.log("PRECIO: matricula-1C", casillasFiltradas[pos].precio);
            await pagar(partida, asignatura.precioCompraCreditos, req.body.username, bancarrota);
        }
        else if (casillasFiltradas[pos].precio == asignatura.precio1C) {
            console.log("PRECIO: 1C-2C");
            casillasFiltradas[pos].precio = asignatura.precio2C

            await pagar(partida, asignatura.precioCompraCreditos, req.body.username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio2C) {
            console.log("PRECIO: 2C-2C");
            casillasFiltradas[pos].precio = asignatura.precio3C
            await pagar(partida, asignatura.precioCompraCreditos, req.body.username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio3C) {
            console.log("PRECIO: 3C-3C");
            casillasFiltradas[pos].precio = asignatura.precio4C
            await pagar(partida, asignatura.precioCompraCreditos, req.body.username, bancarrota);

        } else if (casillasFiltradas[pos].precio == asignatura.precio4C) {
            console.log("PRECIO: 4C-4C");
            // sin cambios
        }

        console.log(casillasFiltradas[pos]);

        try {
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas");

            const result = await modeloAsignaturasComprada.updateOne({ "coordenadas.h": req.body.coordenadas.h, "coordenadas.v": req.body.coordenadas.v }, { $set: { precio: casillasFiltradas[pos].precio } })
            if (result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado la asignatura comprada correctamente");
                res.status(200).json("ok");
            } else {
                console.log(result);
                res.status(500).json({ error: 'Error al actualizar la casilla comprada al aumentar creditos' });
            }

        } catch (error) {
            console.error(error);
            console.log('Error al aumentar creditos asignatura');
            res.status(500).json({ error: 'Error al aumentar creditos asignatura' });

        } finally {
            mongoose.disconnect();
            console.log("DisConnected to MongoDB Atlas")
        }
    }
    else {
        res.status(500).json({ error: 'Error al aumentar creditos asignatura' });
    }
}


async function puedoAumentar(coordenadas, idPartida, username) {
    console.log("PUT Puedo Aumentar creditos asignatua");
    // Comprobar que tiene todos los del mismo cuatrimestre
    // Aumentar creditos + 1 (cambiar precio en asignaturas_partida --> Comparar precio actual en info_asignaturas)
    // Devolver ok
    console.log("COOORDENADAS", coordenadas);
    const cuatri = await devolverCuatri(coordenadas);
    console.log("CUATRI", cuatri);
    let casillas = await findAsignaturasCompradas(username, idPartida);
    console.log("CASILLAS ", casillas);
    let casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].cuatrimestre === cuatri) {
            casillasFiltradas.push(casillas[i]);
        }
    }

    console.log("CASILLAS FILTRADAS", casillasFiltradas);
    var todos = false;

    if ((cuatri == 1 || cuatri == 8) && (casillasFiltradas.length == 2)) {
        todos = true;
        console.log("HOLA 1");
    } else if ((cuatri != 1 || cuatri != 8) && (casillasFiltradas.length == 3)) {
        todos = true;
        console.log("HOLA 2");
    }
    return todos;
}

/**
 * 
 * @param {*} req.body.idPartida
 * @param {*} req.body.username
 * @param {*} req.body.coordenadas 
 * @param {*} res 
 */
async function vender(req, res) {
    console.log("METHOD Delete Vender Asignatura");

    console.log(req.body);
    //mirar que tine la asignatura
    let casillas = await findAsignaturasCompradas(req.body.username, req.body.idPartida);
    console.log("CASILLAS ", casillas);
    casillasFiltradas = [];
    for (let i = 0; i < casillas.length; i++) {
        if (casillas[i].coordenadas.h === req.body.coordenadas.h && casillas[i].coordenadas.v === req.body.coordenadas.v) {
            casillasFiltradas.push(casillas[i]);
        }
    }
    if (casillasFiltradas.length === 1) {
        try {
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas");
            //borrarla
            const result = await modeloAsignaturasComprada.deleteOne({
                "coordenadas.h": req.body.coordenadas.h, "coordenadas.v": req.body.coordenadas.v,
                partida: req.body.idPartida, jugador: req.body.username
            });
            if (result.deletedCount == 1) {
                console.log(result);
                console.log("Se ha vendido la asignatura correctamente ");
                //devolverle el dinero
                //buscar la asignatura
                //buscar la partida
                const casilla = await asignaturaInfo(req.body.coordenadas);
                if (casilla) {
                    const partida = await ctrlPartida.findPartida(req.body.idPartida);
                    if (partida) {
                        await pagar(partida, casilla.devolucionMatricula, req.body.username);
                        res.status(200).json("ok");
                    } else {
                        res.status(500).json({ error: 'Error al actualizar la venta de la casilla, no existe la partida' });
                    }

                } else {
                    res.status(500).json({ error: 'Error al actualizar la venta de la casilla, no existe la casilla' });
                }
                
            } else {
                console.log(result);
                res.status(500).json({ error: 'Error al actualizar la venta de la casilla' });
            }


        } catch (error) {
            console.error(error);
            console.log('Error al aumentar creditos asignatura');
            res.status(500).json({ error: 'Error al aumentar creditos asignatura' });

        } finally {
            mongoose.disconnect();
            console.log("DisConnected to MongoDB Atlas")
        }

    }else{
        res.status(500).json({ error: 'Error al vender de la casilla, esa asignatura no es propiedad del usuario' });
    }





}

module.exports = { checkCasilla, comprarCasilla, infoAsignatura, listaAsignaturasC, aumentarCreditos, vender };
