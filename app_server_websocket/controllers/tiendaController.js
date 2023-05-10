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

            w.logger.verbose("Documento encontrado: " + tienda);
            const usuario = await modeloUser.findOne({nombreUser: username}).exec();
            w.logger.verbose("Documento encontrado: " + usuario);
            usuario.productosComprados.forEach(elemento => {
                w.logger.verbose("Elemento: " + elemento);
                const indice = tienda.findIndex(objeto => objeto.imagen === elemento);
                w.logger.verbose("Indice: " + indice);
                if (indice >= 0){
                    tienda[indice].comprado = true;

                    if (tienda[indice].imagen === usuario.imagen) {
                        tienda[indice].usado = true;
                    }
                }
            });
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

module.exports = { devolverTienda };