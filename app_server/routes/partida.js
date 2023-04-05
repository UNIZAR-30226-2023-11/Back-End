var express = require('express');
var router = express.Router();
var ctrlPartida = require('../controllers/partidaController');

router.post('/crear', ctrlPartida.crearUsername);

module.exports = router;