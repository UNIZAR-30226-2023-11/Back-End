var config = require('../config/config');
var modeloPartida = require('../models/partidaModel')
const mongoose = require("mongoose");
const w = require('../winston')

var tablero = require('../controllers/tableroController');
const modeloTarjetas = require('../models/tarjetasModel');
const modeloTarjetasEnMano = require('../models/tarjetasEnMano');
//var asignatura = require('../controllers/asignaturasController');
//const w = require('../winston')

// var partidaController = require('./partidaController');

/**
 * 
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} username Jugador que se declara en bancarrota
 * @param {*}  
 */
async function cartaJulio(partida, username) {
    w.logger.verbose("***POST METHOD Tiene carta salir de julio");

    // const partida = await partidaController.findPartida(idPartida);
    const jugador = username;

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.verbose("Connected to MongoDB Atlas");
    try {
        const cartaEncontrada = await modeloTarjetasEnMano.findOne({ nombre: "¡Qué suerte, te libras!", partida: partida.id, jugador: jugador }).exec();
        // res.status(200).json(cartaEncontrada);
        return cartaEncontrada;

    } catch (error) {
        w.logger.error("Error: ", error);
        w.logger.verbose("Error al obtener las cartas del jugador");
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}


/**
 *  
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} username Jugador que se declara en bancarrota
 * @param {*}  
 */
//TODO: HACER EL SOCKET ON DEL SERVIDOR
async function usarCartaJulio(partida, username) {
    w.logger.verbose("***POST METHOD Usar carta salir de julio");

    const jugador = username;

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.verbose("Connected to MongoDB Atlas");
    try {
        await modeloPartida.deleteOne({ nombre: "¡Qué suerte, te libras!", partida: partida.id, jugador: jugador });

        return 0;
        // res.status(200).send("Carta usada con éxito");

    } catch (error) {
        w.logger.error("Error: ", error);
        w.logger.error("Error al obtener las cartas del jugador");
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}


async function anadirCartaJulio(username, partida) {
    w.logger.verbose("***POST METHOD Añadir carta salir de julio a un jugador");

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.verbose("Connected to MongoDB Atlas");

    try {
        const doc = new modeloTarjetasEnMano({
            nombre: "¡Qué suerte, te libras!",
            partida: partida.id,
            jugador: username
        });
        await doc.save();
        w.logger.verbose('Documento guardado correctamente')
        return 0;
        // res.status(200).send("Carta agnadida con éxito");

    } catch (error) {
        w.logger.error("Error: ", error);
        w.logger.debug("Error al obtener las cartas del jugador");
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.verbose("Disconnected to MongoDB Atlas")
    }
}


async function findCarta(nombre) {
    w.logger.verbose("*** METHOD Find carta");

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.verbose("Connected to MongoDB Atlas");

    try {

        const cartaEncontrada = await modeloTarjetas.findOne({ nombre: nombre }).exec();
        w.logger.debug("Nombre: ", nombre);
        w.logger.debug("CartaEncontrada: ", cartaEncontrada);

        if (cartaEncontrada) {
            // Accede a los atributos de la carta utilizando la sintaxis objeto.atributo
            return cartaEncontrada;
        } else {
            w.logger.debug("Carta no encontrada");
            return null;
        }
    }
    catch (error) {
        w.logger.error("Error: ", error);
        w.logger.error('Error al encontrar carta');
        return null;

    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}



/**
 * 
 * @param {*} partida Partida de tipo modeloPartida
 * @param {*} username Jugador que se declara en bancarrota
 * @param {*} tarjeta Nombre de la tarjeta
 * @param {*} coordenadas coordenadas actuales del jugador 
 */
//TODO: HACER EL SOCKET ON DEL SERVIDOR
async function accionCarta(partida, username, tarjeta, coordenadas) {
    w.logger.verbose("***POST METHOD Devuelve lo que tiene que hacer un jugador segun la carta que le ha salido");

    const carta = await findCarta(tarjeta.nombre);
    const jugador = username
    const posicion = partida.nombreJugadores.indexOf(jugador);


    if (carta != null) {
        if (carta.cobrarPagarNada == "pagar") { // pagar
            var cantidad = carta.dinero;
            if (carta.nombre == "¡Qué mala suerte!") { } // TODO:
            // else if (carta.nombre == "¡Ay las entregas!") { cantidad = 20; } // 20
            // else if (carta.nombre == "Ay") { cantidad = 50; } // 50
            // else if (carta.nombre == "¡Vas a la cafetería!") { cantidad = 55; } // 55
            // else if (carta.nombre == "A comer en el Ada Byron") { cantidad = 100 } // 100
            // else if (carta.nombre == "Conductor novel") { cantidad = 100; } // 100
            // else if (carta.nombre == "¡Vaya!") { cantidad = 250 } // 250
            // else if (carta.nombre == "Ganas de algo dulce") { cantidad = 275; } // 275
            // else if (carta.nombre == "La luz está cara") { cantidad = 300; } // 300
            // else if (carta.nombre == "¡Felicidades, te has graduado!") { cantidad = 500; } // 500
            // else if (carta.nombre == "¡Estamos en el ecuador!") { cantidad = 550; } // 550
            // else if (carta.nombre == "Unizar necesita dinero") { cantidad = 1000; } // 1000
            console.log("Cantidad: ", cantidad, " , ", partida.dineroJugadores[posicion]);
            partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] - cantidad;
            console.log("Cantidad: ", partida.dineroJugadores[posicion]);
            // partida.dineroJugadores[posicion] -= cantidad;

        } else if (carta.cobrarPagarNada == "cobrar") { // cobrar
            var cantidad = carta.dinero;
            // if (carta.nombre == "¡Feliz cumpleaños!") { cantidad = 150; } // 150
            // else if (carta.nombre == "¡Qué suerte!") { cantidad = 1; } //1
            // else if (carta.nombre == "¡Enhorabuena!, la beca") { cantidad = 600; } //600
            // else if (carta.nombre == "¡Enhorabuena!") { cantidad = 500; } //500
            // else if (carta.nombre == "¡Qué inteligente eres!") { cantidad = 200; } //200
            // else if (carta.nombre == "¡Qué suerte!") { cantidad = 20; } //20

            partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] + cantidad;
            // artida.dineroJugadores[posicion] += cantidad;

        } else if (carta.cobrarPagarNada == "nada") { // nada
            var h = 0;
            var v = 0;
            var dinero = 0;
            if (carta.nombre == "Vaya, tienes que ir a Segunda Convocatoria") { h = 0; v = 10; }
            else if (carta.nombre == "¡Qué suerte!, a la salida") { h = 10; v = 10; }
            else if (carta.nombre == "¡Qué suerte, te libras!") { await anadirCartaJulio(jugador, partida.idPartida); }
            else if (carta.nombre == "¡FIESTA!") {
                h = 5; v = 0;
                if (tablero.pasaPorSalida(req.body.coordenadas, { h: h, v: v })) {
                    dinero = 200;
                }
            }
            else if (carta.nombre == "¡Ya queda poco!") { h = 10; v = 9; }
            else if (carta.nombre == "¡Qué suerte!") {
                h = 9; v = 0;
                if (tablero.pasaPorSalida(coordenadas, { h: h, v: v })) {
                    dinero = 200;
                }
            }
            else if (carta.nombre == "¡Vaya!") { tablero.retroceder(coordenadas, 5); }
            else if (carta.nombre == "Esto no se hace") {
                h = 0; v = 10;
                const posicion = partida.nombreJugadores.indexOf(username);
                partida.carcel[posicion] = true;
            }

            partida.posicionJugadores[posicion] = { h: h, v: v };
            partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] + dinero;
        }

        // console.log(partida.posicionJugadores);
        console.log(partida.dineroJugadores);

        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.verbose("Connected to MongoDB Atlas");
        try {
            w.logger.debug("idPartida: ", partida.id)

            const result1 = await modeloPartida.updateOne({ id: partida.id }, {
                $set: {
                    "posicionJugadores": partida.posicionJugadores,
                    "dineroJugadores": partida.dineroJugadores
                }
            })
            if (result1.modifiedCount == 1) {
                w.logger.debug("Result: ", result1);
                w.logger.debug("Se ha actualizado la partida correctamente");
                return 0;
                // res.status(200).json("Se ha actualizado la partida correctamente");
            } else {
                // console.error(error);
                w.logger.debug("Result: ", result1);
                return 1;
                // res.status(205).json({ error: 'Error al actualizar la partida ' }); // es 205 porque puede ser que un jugador no haga nada en su turno
            }

            // const result2 = await modeloPartida.updateOne({ id: partida }, {
            //     $set: {
            //         dineroJugadores: partida.dineroJugadores
            //     }
            // })
            // if (result1.modifiedCount == 1) {
            //     console.log(result2);
            //     console.log("Se ha actualizado la partida correctamente");
            //     res.status(200).json("Se ha actualizado la partida correctamente");
            // } else {
            //     console.error(error);
            //     console.log(result2);
            //     res.status(205).json({ error: 'Error al actualizar la partida ' }); // es 205 porque puede ser que un jugador no haga nada en su turno
            // }
        } catch (error) {
            w.logger.error("Error: ", error);
            w.logger.error("Error al obtener las cartas del jugador");
            return 2;
        } finally {
            mongoose.disconnect();
            w.logger.verbose("DisConnected to MongoDB Atlas")
        }
    }
}




/**
 * FUNCIONA
 * @param {*} tipo
 * @param {*} username
 * @param {*} partida  Objeto
 * @param {*} res Devuelve una tarjeta aleatoria.
 */
//TODO: guardar que tarjeta le sale a cada usuario

async function tarjetaAleatoria(tipo, username, idPartida, coordenadas) {
    w.logger.verbose("***METHOD GET Para obtener tarjeta aleatoria ");
    
    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.verbose("Connected to MongoDB Atlas")

    try {
        // var tipoP = tipo;
        //console.log(tipoP);
        //const resultado = await modeloTarjetas.aggregate([{$sample: {size: 1}}]).exec();
        const resultado = await modeloTarjetas.aggregate([
            { $match: { tipo: tipo } },
            { $sample: { size: 1 } }
        ]).exec();

        idPartida = 1;
        await accionCarta(idPartida, username, resultado[0], coordenadas);


        // res.status(200).json(resultado);
        return resultado[0];
    } catch (error) {
        w.logger.error("Error: ", error);
        return 2;
        // res.status(500).json({ mensaje: 'Error al obtener tarjeta aleatoria' });
    } finally {
        mongoose.disconnect();
        w.logger.verbose("DisConnected to MongoDB Atlas")
    }
}

module.exports = { cartaJulio, usarCartaJulio, findCarta, tarjetaAleatoria };


