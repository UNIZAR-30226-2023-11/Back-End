var config = require('../config/config');
var modeloTienda = require('../models/tiendaModel')
var modeloUser = require('../models/userModel')
const mongoose = require("mongoose");
const w = require('../winston')

async function devolverTienda(username) {
    w.logger.info("***POST METHOD Devolver tienda");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas")

        //toda la tienda
        const docs = await modeloTienda.find({});
        if (docs.length > 0) {
            w.logger.debug("Documento encontrado: ", docs.toString());
            const user = await modeloUser.find(doc);
            if (tienda.length > 0) {
                w.logger.debug("Documento encontrado: ", user);
                user.productosComprados.forEach(elemento => {
                    tienda.indexOf(elemento.nombreUser);
                });


        } else {
            w.logger.debug('No se encontró el documento');
            return 0;
        }
        
        const doc = modeloUser ({
            nombreUser: username
        });        
    }
    catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({error: 'Error al crear usuario', nombreuser: req.body.username, correo: req.body.email, contraseña: req.body.password});
    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}

module.export = {
    devolverTienda
}