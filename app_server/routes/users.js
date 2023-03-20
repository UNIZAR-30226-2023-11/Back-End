var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/usersController');

//router.get('/:nombre/:telefono', ctrlUsers.createUser);
router.get('/', ctrlUsers.findUser);
router.post('/', ctrlUsers.createUser);
router.delete('/', ctrlUsers.deleteUser);

module.exports = router;
