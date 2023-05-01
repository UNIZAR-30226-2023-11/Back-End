var express = require('express');
var router = express.Router();
var ctrlPartida = require('../controllers/partidaController');

var ctrlAsignatura = require('../controllers/asignaturasController');


router.post('/crear', ctrlPartida.crearPartida);


router.put('/unirJugador', ctrlPartida.unirJugador);
router.put('/tarjeta', ctrlAsignatura.tarjetaAleatoria);
//router.post('/jugadoresUpdate', ctrlAsignatura.checkCasilla);
//router.get('/encontrar', ctrlPartida.findPartida);  //Esta es privada
router.put('/casilla', ctrlAsignatura.checkCasilla);
router.put('/comprar', ctrlAsignatura.comprarCasilla);
router.post('/lanzarDados', ctrlPartida.lanzardados);

router.put('/actualizar', ctrlPartida.actualizarPartida);
router.put('/listaJugadores', ctrlPartida.listaJugadores);

router.put('/casillaSalida', ctrlAsignatura.dar200);
router.put('/infoAsignatura', ctrlAsignatura.infoAsignatura);

router.put('/listaAsignaturasC', ctrlAsignatura.listaAsignaturasC);

router.put('/siguienteTurno', ctrlPartida.siguienteTurno);

router.put('/turnoActual', ctrlPartida.turnoActual);

router.put('/bancarrota', ctrlPartida.bancarrota);

router.put('/aumentar', ctrlAsignatura.aumentarCreditos);

router.post('/numJugadores', ctrlPartida.numJugadores);

router.post('/cartaJulio', ctrlPartida.cartaJulio);

router.post('/usarCartaJulio', ctrlPartida.usarCartaJulio);

module.exports = router;