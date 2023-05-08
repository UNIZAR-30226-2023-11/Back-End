var config = require('../config/config');
var modeloTienda = require('../models/tiendaModel')
var modeloImagen = require('../models/imagenModel')
const mongoose = require("mongoose");
const w = require('../winston')

async function devolverTienda() {
    w.logger.info("***POST METHOD Devolver tienda");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas")

        const docs = await modeloUser.find({});

        if (docs.length > 0) {
            w.logger.debug("Documento encontrado: ", docs.toString());
            return docs;
        } else {
            w.logger.debug('No se encontró el documento');
            return 0;
        }
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