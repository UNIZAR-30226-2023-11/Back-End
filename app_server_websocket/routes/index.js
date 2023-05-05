var express = require('express');
var router = express.Router();

var ctrlRoot = require('../controllers/rootController')
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', ctrlRoot.homeController);

router.post('/', ctrlRoot.test);
module.exports = router;
