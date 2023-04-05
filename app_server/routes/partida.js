var express = require('express');
var router = express.Router();
var ctrlPartida = require('../controllers/partidaController');

router.post('/crear', ctrlPartida.crearPartida);
router.get('/encontrar', ctrlPartida.findPartida);

module.exports = router;