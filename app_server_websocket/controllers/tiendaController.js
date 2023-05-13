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
    
    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.info("Connected to MongoDB Atlas");

    try {

        tienda = await modeloTienda.find({});
        if (tienda.length > 0) {

            w.logger.verbose("Documento encontrado: " , tienda);
            usuario = await modeloUser.findOne({nombreUser: username}).exec();
            w.logger.verbose("Documento encontrado: " , usuario);

            usuario.productosComprados.forEach(elemento => {
                w.logger.verbose("Elemento: " , elemento);
                const indice = tienda.findIndex(objeto => objeto.imagen === elemento);
                w.logger.verbose("Indice: " , indice);
                if (indice >= 0){
                    tienda[indice].comprado = true;
        
                    if (tienda[indice].imagen === usuario.imagen) {
                        tienda[indice].usado = true;
                    }
                }
            });

            for (const elemento of tienda) {
                const image = await modeloImagen.findOne({nombre: elemento.imagen}).exec();
                elemento.imagen = image.imagen;
            }
        }
        return tienda;

    } catch (error) {
        w.logger.error(error);
        return 2;

    } finally {
        await mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas");
    }º
}

async function comprarTienda (producto, username) {
    w.logger.info("***METHOD Comprar producto de la tienda");

    await mongoose.connect(config.db.uri, config.db.dbOptions);
    w.logger.debug("Connected to MongoDB Atlas");

    try {

        const usuario = await modeloUser.findOne({nombreUser: username}).exec();
        const tam = usuario.productosComprados.length;
        usuario.productosComprados[tam] = producto;

        const result = await modeloUser.updateOne({ nombreUser: username }, {
            $set: {
                productosComprados: usuario.productosComprados
            }
        });

        if (result.modifiedCount == 1) {
            w.logger.debug("Result: ", result);
            w.logger.verbose("Se han actualizado los productos del usuario correctamente");
            return 0;
        } else {
            //console.error(error);
            w.logger.error("NO SE HAN MODIFICADO LOS PRODUCTOS DEL USUARIO")
        
            w.logger.debug("Result: ", result);
            return 1;
        }

    } catch (error) {
        w.logger.error(`Error: ${error}`);
        return 2;

    } finally {
        await mongoose.disconnect();
        w.logger.debug("DisConnected to MongoDB Atlas");
    }
}

module.exports = { devolverTienda, comprarTienda };