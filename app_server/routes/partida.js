var express = require('express');
var router = express.Router();
var ctrlPartida = require('../controllers/partidaController');

var ctrlAsignatura = require('../controllers/asignaturasController');


router.post('/crear', ctrlPartida.crearPartida);
router.put('/unirJugador', ctrlPartida.unirJugador);
//router.post('/jugadoresUpdate', ctrlAsignatura.checkCasilla);
//router.get('/encontrar', ctrlPartida.findPartida);  //Esta es privada

module.exports = router;