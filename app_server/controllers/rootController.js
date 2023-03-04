function homeController (req, res, next){
    res.render('index', {title: Express} );
  }

function homeController_dev (req, res, next){
    res.render('index', {title: Express} );
  }

function test (req, res, next){
    res.render('index', {title: Express} );
  }



module.exports = {homeController, homeController_dev, test};