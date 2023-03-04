var express = require('express');
var router = express.Router();


var ctrlUsers = require('../controllers/usersController');

router.get('/', ctrlUsers.createUser);
router.post('/', ctrlUsers.createUser);
// router.delete('/:idSong', ctrlUsers.deleteSong);
// router.put('/:idSong', ctrlUsers.updateSong);
// router.put('/', ctrlUsers.updateSong);

module.exports = router;