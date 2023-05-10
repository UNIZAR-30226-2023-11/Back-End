var config = require('../config/config');
var modeloTienda = require('../models/tiendaModel')
var modeloUser = require('../models/userModel')
const mongoose = require("mongoose");
const w = require('../winston')

async function devolverTienda(username) {
    w.logger.info("***POST METHOD Devolver tienda");

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        const tienda = await modeloTienda.find({});
        if (tienda.length > 0) {
            w.logger.verbose("Documento encontrado: " + tienda.toString());
            const usuario = await modeloUser.find({nombreUser: username});
            if (tienda.length > 0) {
                w.logger.debug("Documento encontrado: ", user);
                user.productosComprados.forEach(elemento => {
                    const indice = tienda.indexOf(elemento.nombreUser);
                    tienda.comprado[indice] = true;

                    if (tienda.imagen[indice] === usuario.imagen) {
                        tienda.usado[indice] = true;
                    }
                });
            }   
        }

        return tienda;

    } catch (error) {
        w.logger.error(error);
        return 2;

    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas");
    }
}

module.export = {
    devolverTienda
}