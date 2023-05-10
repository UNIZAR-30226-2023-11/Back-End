var express = require('express');
var router = express.Router();
var ctrlUsers = require('../controllers/usersController');

router.post('/register', ctrlUsers.registerUser);
router.post('/login', ctrlUsers.loginUser);
router.delete('/delete', ctrlUsers.deleteUser);
router.put('/updatePassword', ctrlUsers.updatePassword);
router.put('/updateCorreo', ctrlUsers.updateCorreo);
router.put('/updateUsername', ctrlUsers.updateUsername);
router.post('/devolverCorreo', ctrlUsers.devolverCorreo);

module.exports = router;