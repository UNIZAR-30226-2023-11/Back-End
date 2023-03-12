var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/usersController');

router.get('/:nombre/:telefono', ctrlUsers.createUser);
router.get('/', ctrlUsers.deleteUser);

module.exports = router;
