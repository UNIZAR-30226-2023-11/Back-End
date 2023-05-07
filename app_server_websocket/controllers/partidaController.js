var config = require('../config/config');
var modeloPartida = require('../models/partidaModel')
const mongoose = require("mongoose");
const w = require('../winston')

var tablero = require('../controllers/tableroController');
const modeloTarjetas = require('../models/tarjetasModel');
const modeloTarjetasEnMano = require('../models/tarjetasEnMano');
//var asignatura = require('../controllers/asignaturasController');

const casillaInicio = 10;

/**
 * 
 * @param {*} username Nombre del ususario que crea la partida.
 * @param {*} dineroInicial Dinero inicial con el que empezarán los jugadores la partida. 
 * @param {*} normas Todavia no esta introducido esta funcionalidad.
 * @param {*} nJugadores Numero de jugadores que jugarán
 * @param {*} return 0 si todo OK , o 2 si ocurre un error en la función
 */
async function crearPartida(username, dineroInicial, nJugadores) {
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
            id : doc.id
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
 * @param {*} req.body.idPartida Identificador de la partida
 * @param {*} res 
 */
async function listaJugadores(req, res) {
    console.log("***GET METHOD lista jugadores partida");
    try {

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: req.body.idPartida }).exec();
        console.log(partidaEncontrada);

        if (partidaEncontrada) {
            var lista = [];
            for (let i = 0; i < partidaEncontrada.nombreJugadores.length; i++) {
                lista.push([partidaEncontrada.nombreJugadores[i], partidaEncontrada.dineroJugadores[i]], partidaEncontrada.posicionJugadores[i]);
            }
            console.log(lista);
            res.status(200).json({
                listaJugadores: partidaEncontrada.nombreJugadores,
                listaDineros: partidaEncontrada.dineroJugadores,
                listaPosiciones: partidaEncontrada.posicionJugadores,
                listaTuplas: lista
            });

        } else {
            console.log("La partida no existe");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener la lista de jugadores de la partida' });
    } finally {
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
async function actualizarPartida(req, res) {
    console.log("***PUT METHOD Actualizar partida");
    try {

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: req.body.idPartida }).exec();
        console.log(partidaEncontrada);

        if (partidaEncontrada) {
            //const tam = partidaEncontrada.nombreJugadores.length;
            for (let i = 0; i < partidaEncontrada.nombreJugadores.length; i++) {
                partidaEncontrada.dineroJugadores[i] = req.body.dineroInicial;
                console.log(partidaEncontrada.dineroJugadores[i]);

            }
            partidaEncontrada.numeroJugadores = req.body.nJugadores;
            //console.log(partidaEncontrada.numeroJugadores, req.body.nJugadores );

            //Actualizamos la partida
            const result = await modeloPartida.updateOne({ id: req.body.idPartida }, {
                $set: {
                    dineroJugadores: partidaEncontrada.dineroJugadores,
                    numeroJugadores: partidaEncontrada.numeroJugadores
                }
            })
            if (result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado la partida correctamente");
                res.status(200).json("Se ha actualizado la partida correctamente");
            } else {
                //console.error(error);
                console.log(result);
                res.status(205).json({ error: 'Error al actualizar la partida ' }); // es 205 porque puede ser que un jugador no haga nada en su turno
            }

        } else {
            console.log("La partida no existe");
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar partida' });
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
function estaJugador(username, vJugadores) {
    return vJugadores.includes(username);
}

/**
 * @param {*} req.body.idPartida Identificador de la partida a la que desea unirse (el codigo).
 * @param {*} req.body.username Nombre del usuario que desea unirse a la partida. 
 * @param {*} res 
 */
async function unirJugador(req, res) {
    console.log("***PUT METHOD Actualizar partida se añaden jugadores");
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: req.body.idPartida }).exec();
        console.log(partidaEncontrada);

        if (partidaEncontrada) {
            if (!estaJugador(req.body.username, partidaEncontrada.nombreJugadores) 
            && partidaEncontrada.nombreJugadores.length < partidaEncontrada.numeroJugadores) {
                //Si no esta el jugador lo añadimos
                //Añadimos el jugador a nombreJugadores, posicionJugadores, y dineroJugadores
                const tam = partidaEncontrada.nombreJugadores.length;

                //Añadimos jugador a nombreJugadores
                partidaEncontrada.nombreJugadores[tam] = req.body.username;
                //Añadimos jugador a posicionJugadores, en este caso la inicial.
                partidaEncontrada.posicionJugadores[tam] = { h: casillaInicio, v: casillaInicio, julio: false };
                //Añadimos jugador a dineroJugadores, en este caso con el dinero inicial
                partidaEncontrada.dineroJugadores[tam] = partidaEncontrada.dineroJugadores[0];

                // Accede a los atributos de la partida utilizando la sintaxis objeto.atributo
                console.log(partidaEncontrada);

                //Actualizamos la partida
                const result = await modeloPartida.updateOne({ id: req.body.idPartida }, {
                    $set: {
                        nombreJugadores: partidaEncontrada.nombreJugadores,
                        posicionJugadores: partidaEncontrada.posicionJugadores,
                        dineroJugadores: partidaEncontrada.dineroJugadores
                    }
                })
                if (result.modifiedCount == 1) {
                    console.log(result);
                    console.log("Se ha actualizado la partida correctamente");
                    res.status(200).json("Se ha actualizado la partida correctamente");
                } else {
                    //console.error(error);
                    console.log(result);
                    res.status(205).json({ error: 'Error al actualizar la partida ' }); // es 205 porque puede ser que un jugador no haga nada en su turno
                }
            } else {
                //Ya esta el jugador no hay que hacer nada
                res.status(200).json("El jugador ya se ha unido o ya no se pueden más jugadores");
            }

        } else {
            console.log("Partida no encontrada");
            res.status(404).json({ error: 'No hay ninguna partida con ese id' });
        }
    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar partida');
        res.status(500).json({ error: 'Error al encontrar partida' });

    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

async function comenzarPartida(req, res) {
    console.log("***POST METHOD Comenzar partida");

}

/**
 * 
 * @param {*} req.body.username Nombre del usuario que lanza los dados 
 * @param {*} req.body.idPartida
 * @param {*} res 
 */
async function lanzardados(req, res) {
    console.log("***POST METHOD Lanzar dados de la partida");

    console.log(req.body.idPartida);
    // Generate two random numbers between 1 and 6
    const dado1 = Math.floor(Math.random() * 6) + 1;
    const dado2 = Math.floor(Math.random() * 6) + 1;

    // Calculate the total
    const total = dado1 + dado2;

    try {
        const partida = await findPartida(req.body.idPartida, res);
        console.log("PARTIDA ENCONTRADA");
        console.log(partida);
        if (partida != null) {
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas");
            //Actualizamos la partida
            const result = await modeloPartida.updateOne({ id: req.body.idPartida }, { $set: { "dados.dado1": dado1, "dados.dado2": dado2, "dados.jugador": req.body.username } })
            if (result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado la partida correctamente, se han añadido los dados y quien los ha lanzado");

                // Send the result as JSON
                console.log({
                    dado1: dado1,
                    dado2: dado2,
                    total: total
                });

                const posicion = partida.nombreJugadores.indexOf(req.body.username);
                var avance = tablero.avanzar(partida.posicionJugadores[posicion], total);

                partida.posicionJugadores[posicion] = avance.coordenadas;
                const resultado = await modeloPartida.updateOne({ id: req.body.idPartida }, { $set: { posicionJugadores: partida.posicionJugadores } })

                if (resultado.modifiedCount != 1) {
                    console.log('Error al actualizar posicion del jugador');
                    res.status(500).json({ error: 'Error al actualizar posicion del jugador' });
                    exit(1);
                }

                if (avance.salida) {
                    //asignatura.dar200(req,res)
                }
                var dado = { dado1, dado2, coordenadas: avance.coordenadas };

                res.status(200).json(dado);
            } else {
                //console.error(error);
                console.log(result);
                res.status(500).json({ error: 'Error al actualizar la partida al lanzar los dados ' });
            }
        } else {
            console.log("Partida no encontrada");
            res.status(404).json({ error: 'No hay ninguna partida con ese id' });
        }
    } catch (error) {
        console.error(error);
        console.log('Error al lanzar los dados en la partida');
        res.status(500).json({ error: 'Error al lanzar los dados en la partida' });
    }
}

async function findPartida(idPartida) {
    console.log("*** METHOD Find partida");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const partidaEncontrada = await modeloPartida.findOne({ id: idPartida }).exec();
        console.log(idPartida);
        console.log(partidaEncontrada);

        if (partidaEncontrada) {
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
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} req.body.idPartida 
 * @param {*} res 
 */
async function siguienteTurno(req, res) {

    const partida = await findPartida(req.body.idPartida, res);
    if (partida != null) {
        const tam = partida.nombreJugadores.length;
        if (partida.dados.jugador == "") {
            //le toca al primero
            partida.dados.jugador = partida.nombreJugadores[0];
            res.status(200).json({ jugador: partida.nombreJugadores[0] });
        } else {
            const posicion = partida.nombreJugadores.indexOf(partida.dados.jugador);
            if (posicion == tam - 1) { //le vuelve a tocar al primero
                try {
                    partida.dados.jugador = partida.nombreJugadores[0];

                    await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    console.log("Connected to MongoDB Atlas");
                    await modeloPartida.updateOne({ id: req.body.idPartida }, { $set: { "partida.dados.jugador": partida.dados.jugador } });

                } catch (error) {
                    console.error(error);
                    console.log("Error al actualizar la partida al cambiar el jugador", partida.id);
                } finally {
                    mongoose.disconnect();
                    console.log("Disconnected to MongoDB Atlas")
                }

                res.status(200).json({ jugador: partida.nombreJugadores[0], posicion: 0 });
            } else {

                try {
                    partida.dados.jugador = partida.nombreJugadores[posicion + 1];

                    await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
                    console.log("Connected to MongoDB Atlas");
                    await modeloPartida.updateOne({ id: req.body.idPartida }, { $set: { "dados.jugador": partida.dados.jugador } });

                } catch (error) {
                    console.error(error);
                    console.log("Error al actualizar la partida al cambiar el jugador", partida.id);
                } finally {
                    mongoose.disconnect();
                    console.log("Disconnected to MongoDB Atlas")
                }

                res.status(200).json({ jugador: partida.nombreJugadores[posicion + 1], posicion: posicion + 1 });
            }
        }

    } else {
        res.status(404).send("Partida no encontrada");
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
 * @param {*} req.body.idPartida Partida de tipo modeloPartida
 * @param {*} req.body.username Usuario al que declaramos en bancarrota
 */
async function bancarrota(req, res) {
    console.log("***PUT METHOD Bancarrota de la partida");
    try {
        const partida = await findPartida(req.body.idPartida, res);
        const jugador = req.body.username;

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const posicion = partida.nombreJugadores.indexOf(jugador);
        partida.dineroJugadores.splice(posicion, 1);
        partida.nombreJugadores.splice(posicion, 1);
        partida.posicionJugadores.splice(posicion, 1);
        await modeloPartida.updateOne({ id: partida.id }, { $set: { dineroJugadores: partida.dineroJugadores, nombreJugadores: partida.nombreJugadores, posicionJugadores: partida.posicionJugadores } });
        res.status(200).json('Bancarrota');

    } catch (error) {
        console.error(error);
        console.log("Error al actualizar la partida al pagar", partida.id);
    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
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
 * 
 * @param {*} idPartida Partida de tipo modeloPartida
 * @param {*} username Jugador que se declara en bancarrota
 * @param {*}  
 */
async function cartaJulio(req, res) {
    console.log("***POST METHOD Tiene carta salir de julio");

    try {
        const partida = await findPartida(req.body.idPartida, res);
        const jugador = req.body.username;

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const cartaEncontrada = await modeloTarjetasEnMano.findOne({ nombre: "¡Qué suerte, te libras!", partida: partida.id, jugador: jugador }).exec();
        res.status(200).json(cartaEncontrada);

    } catch (error) {
        console.error(error);
        console.log("Error al obtener las cartas del jugador");
    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
    }
}

/**
 *  
 * @param {*} idPartida Partida de tipo modeloPartida
 * @param {*} username Jugador que se declara en bancarrota
 * @param {*}  
 */
async function usarCartaJulio(req, res) {
    console.log("***POST METHOD Usar carta salir de julio");

    try {
        const partida = await findPartida(req.body.idPartida, res);
        const jugador = req.body.username;

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        await modeloPartida.deleteOne({ nombre: "¡Qué suerte, te libras!", partida: partida.id, jugador: jugador });

        res.status(200).send("Carta usada con éxito");

    } catch (error) {
        console.error(error);
        console.log("Error al obtener las cartas del jugador");
    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
    }
}

async function anadirCartaJulio(username, idPartida) {
    console.log("***POST METHOD Añadir carta salir de julio a un jugador");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const doc = new modeloTarjetasEnMano({
            nombre: "¡Qué suerte, te libras!",
            partida: idPartida,
            jugador: username
        });
        await doc.save();
        console.log('Documento guardado correctamente')
        res.status(200).send("Carta agnadida con éxito");

    } catch (error) {
        console.error(error);
        console.log("Error al obtener las cartas del jugador");
    } finally {
        mongoose.disconnect();
        console.log("Disconnected to MongoDB Atlas")
    }
}

async function findCarta(nombre) {
    console.log("*** METHOD Find carta");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const cartaEncontrada = await modeloTarjetas.findOne({ nombre: nombre }).exec();
        console.log(nombre);
        console.log(cartaEncontrada);

        if (cartaEncontrada) {
            // Accede a los atributos de la carta utilizando la sintaxis objeto.atributo
            return cartaEncontrada;
        } else {
            console.log("Carta no encontrada");
            return null;
        }
    }
    catch (error) {
        console.error(error);
        console.log('Error al encontrar carta');
        return null;

    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

/**
 * 
 * @param {*} idPartida Partida de tipo modeloPartida
 * @param {*} username Jugador que se declara en bancarrota
 * @param {*} tarjeta Nombre de la tarjeta
 * @param {*} coordenadas coordenadas actuales del jugador 
 */
async function accionCarta(req, res) {
    console.log("***POST METHOD Devuelve lo que tiene que hacer un jugador segun la carta que le ha salido");
    try {
        const partida = await findPartida(req.body.idPartida, res);
        const carta = await findCarta(req.body.tarjeta);
        const jugador = req.body.username
        const posicion = partida.nombreJugadores.indexOf(jugador);

        if (carta.cobrarPagarNada=="pagar") { // pagar
            var cantidad = carta.dinero;
            if (carta.nombre == "¡Qué mala suerte!") { /* TODO*/ }
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
            console.log("Cantidad: ", cantidad, " , " , partida.dineroJugadores[posicion]);
            partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion]-cantidad;
            console.log("Cantidad: ", partida.dineroJugadores[posicion]);
            // partida.dineroJugadores[posicion] -= cantidad;
            
        } else if (carta.cobrarPagarNada=="cobrar") { // cobrar
            var cantidad = carta.dinero;
            // if (carta.nombre == "¡Feliz cumpleaños!") { cantidad = 150; } // 150
            // else if (carta.nombre == "¡Qué suerte!") { cantidad = 1; } //1
            // else if (carta.nombre == "¡Enhorabuena!, la beca") { cantidad = 600; } //600
            // else if (carta.nombre == "¡Enhorabuena!") { cantidad = 500; } //500
            // else if (carta.nombre == "¡Qué inteligente eres!") { cantidad = 200; } //200
            // else if (carta.nombre == "¡Qué suerte!") { cantidad = 20; } //20

            partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion]+cantidad;
            // artida.dineroJugadores[posicion] += cantidad;
            
        } else if (carta.cobrarPagarNada=="nada") { // nada
            var h = 0;
            var v = 0;
            var dinero = 0;
            if (carta.nombre == "Vaya, tienes que ir a Segunda Convocatoria") { h=0; v=10; }
            else if (carta.nombre == "¡Qué suerte!, a la salida") { h=10; v=10; }
            else if (carta.nombre == "¡Qué suerte, te libras!") { await anadirCartaJulio(jugador,partida.idPartida); }
            else if (carta.nombre == "¡FIESTA!") { 
                h=5; v=0; 
                if (tablero.pasaPorSalida(req.body.coordenadas,{h: h, v: v})) {
                    dinero=200;
                }
            }
            else if (carta.nombre == "¡Ya queda poco!") { h=10; v=9; }
            else if (carta.nombre == "¡Qué suerte!") {
                h=9; v=0; 
                if (tablero.pasaPorSalida(req.body.coordenadas,{h: h, v: v})) {
                    dinero=200;
                }
            }
            else if (carta.nombre == "¡Vaya!") { tablero.retroceder(coordenadas, 5); }
            else if (carta.nombre == "Esto no se hace") { h=0; v=10; }

            partida.posicionJugadores[posicion] = {h: h, v: v};
            partida.dineroJugadores[posicion] = partida.dineroJugadores[posicion] + dinero;
        }

        // console.log(partida.posicionJugadores);
        console.log(partida.dineroJugadores);

        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");

        const result1 = await modeloPartida.updateOne({ id: partida.idPartida }, {
            $set: {
                posicionJugadores: partida.posicionJugadores,
                dineroJugadores: partida.dineroJugadores
            }
        })
        if (result1.modifiedCount == 1) {
            console.log(result1);
            console.log("Se ha actualizado la partida correctamente");
            res.status(200).json("Se ha actualizado la partida correctamente");
        } else {
            // console.error(error);
            console.log(result1);
            res.status(205).json({ error: 'Error al actualizar la partida ' }); // es 205 porque puede ser que un jugador no haga nada en su turno
        }

        // const result2 = await modeloPartida.updateOne({ id: partida.idPartida }, {
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
        console.error(error);
        console.log("Error al obtener las cartas del jugador");

    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

module.exports = { crearPartida, unirJugador, lanzardados, findPartida, actualizarPartida, listaJugadores, siguienteTurno, turnoActual, bancarrota, numJugadores, cartaJulio, usarCartaJulio, accionCarta};
