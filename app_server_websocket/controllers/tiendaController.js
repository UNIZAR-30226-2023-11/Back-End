var config = require('../config/config');
var modeloTienda = require('../models/tiendaModel')
var modeloUser = require('../models/userModel')
var modeloImagen = require('../models/imagenModel')
const mongoose = require("mongoose");
const w = require('../winston')

async function devolverTienda(username) {
    w.logger.info("***POST METHOD Devolver tienda");
    var usuario = null;
    var tienda = null;
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        tienda = await modeloTienda.find({});
        if (tienda.length > 0) {

            w.logger.verbose("Documento encontrado: " + tienda);
            usuario = await modeloUser.findOne({nombreUser: username}).exec();
            w.logger.verbose("Documento encontrado: " + usuario);
        }
            

    } catch (error) {
        w.logger.error(error);
        return 2;

    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas");
    }

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
    
    try {
        tienda.forEach(async elemento => {
            const image = await modeloImagen.findOne({nombre: elemento.imagen}).exec();
            elemento.imagen = image.imagen;
        });

    } catch (error) {
        w.logger.error(error);
        return 2;

    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas");
    }
    tienda.forEach(async elemento => {
        const image = await modeloImagen.findOne({nombre: elemento.imagen}).exec();
        elemento.imagen = image.imagen;
    });


    return tienda;
}

module.exports = { devolverTienda };