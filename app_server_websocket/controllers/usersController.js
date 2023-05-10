var config = require('../config/config');
var modeloUser = require('../models/userModel')
var modeloImagen = require('../models/imagenModel')
const mongoose = require("mongoose");
const w = require('../winston')

async function registerUser(username, password, confirm_password, email) {
    w.logger.info("***POST METHOD Creacion de Usuario");

    const doc = new modeloUser({
        nombreUser: username,
        correo: email,
        contraseña: password,
        //contraseñaDos: req.body.confirm_password,
        monedas: 0,
        victorias: 0,
        partidasJugadas: 0,
        productosComprados: 0,
        partidasEnJuego: 0,
        productosComprados: [],
        // paletaColores: 
        imagen: "userDefecto",
        token: "token 1"
    });

    try {
        if (doc.contraseña == confirm_password) {
            await mongoose.connect(config.db.uri, config.db.dbOptions);
            w.logger.info("Connected to MongoDB Atlas")

            const filtro = { nombreUser: doc.nombreUser };
            const docs = await modeloUser.find(filtro);

            if (docs.length > 0) {
                w.logger.debug("Documento encontrado: ", docs);
                return 3;
            } else {
                w.logger.debug('No se encontró el documento');
                await doc.save();
                w.logger.debug('Documento guardado correctamente')
                return 0;
            }
        } else {
            return 1;
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
    // }
}

async function loginUser(username, password) {
    w.logger.info("***GET METHOD Login");

    const doc = {
        nombreUser: username,
        contraseña: password
    };

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        const docs = await modeloUser.find(doc);

        if (docs.length > 0) {
            w.logger.debug("Documento encontrado: " + docs.toString());
            return 0;
            //res.status(200).send('El usuario ha iniciado sesión correctamente');
        } else {
            w.logger.debug('No se encontró el documento');
            return 1;
            //res.status(500).json({ error: 'Error usuario o contraseña incorrectos',  nombreUser: req.body.username, contraseña: req.body.password });
        }
    } catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({ error: 'Error al buscar el usuario', nombreUser: req.body.username });
    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}

async function deleteUser(username) {
    w.logger.info("***DELETE METHOD Eliminación de Usuario");
    const doc = { nombreUser: username };

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");
        const docs = await modeloUser.find(doc);

        const result = await modeloUser.deleteOne(doc);
        if (result.deletedCount === 1) {
            w.logger.debug("Se ha eliminado correctamenre");
            return 0;
            //res.status(200).json({message: 'Usuario eliminado correctamente'})
        } else {
            w.logger.debug("No habia ningún usuario con esos datos.");
            return 1;
            //res.status(400).json({error: 'Error al eliminar usuario. Bad Request'});
        }
        //}
    } catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({ error: 'Error al eliminar el usuario', nombreuser: req.body.username });
    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}

async function updatePassword(username, password, confirm_password) {
    w.logger.info("***PUT METHOD Actualizar la contraseña");

    const doc = {
        nombreUser: username,
        contraseña: password,
        contraseñaDos: confirm_password
    };

    console.log(doc);
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        //const docs = await modeloUser.find(doc);

        const result = await modeloUser.updateOne({ nombreUser: username }, { $set: { contraseña: doc.contraseñaDos } })

        if (result.modifiedCount == 1) {
            console.log(result);
            w.logger.debug("Se ha actualizado la contraseña correctamente");
            return 0;
            //res.status(200).json("Se ha actualizado la contraseña correctamente"); 
        } else {
            //console.error(error);
            console.log(result);
            return 1;
            //TODO:Probar que si se quita este lo coge el otro
            //res.status(500).json({ error: 'Error al actualizar la contraseña 3', nombreUser: req.body.username, res: result });
        }

    } catch (error) {
        console.error(error);
        return 2;
        // res.status(500).json({ error: 'Error al actualizar la contraseña', nombreUser: req.body.username, res: result  });
    }
    finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}

async function updateCorreo(username, email) {
    w.logger.info("***PUT METHOD Actualizar el correo");

    const doc = {
        nombreUser: username,
        correo: email,
    };

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        //const docs = await modeloUser.find(doc);
        const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser }, { $set: { correo: doc.correo } })
        if (result.modifiedCount == 1) {
            console.log(result);
            w.logger.debug("Se ha actualizado el correo correctamente");
            return 0;
            //res.status(200).json("Se ha actualizado el correo correctamente"); 
        } else {
            //console.error(error);
            console.log(result);
            return 1;
            //TODO:Probar que si se quita este lo coge el otro
            // res.status(500).json({ error: 'Error al actualizar el correo 3', nombreUser: req.body.username, res: result });
        }

    } catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({ error: 'Error al actualizar el correo', nombreUser: req.body.username });
    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}


async function updateUsername(username, newusername) {
    w.logger.info("***PUT METHOD Actualizar el username");

    const doc = {
        nombreUser: username,
        newnombreUser: newusername
    };

    // if(findUser(doc.newnombreUser) == 0){
    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
//TODO: BUSCAR QUE ESTE NOMBRE DE USUARIO NO ESTE COGIDO
        w.logger.info("Connected to MongoDB Atlas");
        //const docs = await modeloUser.find(doc);
        const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser }, { $set: { nombreUser: doc.newnombreUser } })
        if (result.modifiedCount == 1) {
            console.log(result);
            w.logger.debug("Se ha actualizado el nombre de usuario correctamente");
            return 0;
            //res.status(200).json("Se ha actualizado el nombre de usuario correctamente"); 
        } else {
            //console.error(error);
            console.log(result);
            return 1;
            //TODO:Probar que si se quita este lo coge el otro
            //res.status(500).json({ error: 'Error al actualizar el nombre de usuario 3', nombreUser: req.body.username, res: result });
        }

    } catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({ error: 'Error al actualizar el nombre de usuario', nombreUser: req.body.username });
    } finally {
        mongoose.disconnect();
    }
}

async function infoUsuario(username) {
    w.logger.info("***POST METHOD Devolver usuario");
    w.logger.verbose(username)
    const doc = {
        nombreUser: username
    };

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        const docs = await modeloUser.find(doc);

        if (docs.length > 0) {
            w.logger.debug("Documento encontrado: " + docs[0].toString);
            w.logger.verbose(docs[0]);
            const image = await modeloImagen.findOne({nombre: docs[0].imagen}).exec();
            docs[0].imagen = image.imagen;
            return docs[0];

        } else {
            w.logger.debug('No se encontró el documento');
            return 1;
        }
    } catch (error) {
        console.error(error);
        return 2;
    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}


async function devolverImagenPerfil(username) {
    w.logger.info("***Devolver imagen perfil");
    console.log(username)
    const doc = {
        nombreUser: username
    };

    try {
        await mongoose.connect(config.db.uri, config.db.dbOptions);
        w.logger.info("Connected to MongoDB Atlas");

        const docs = await modeloUser.find(doc);

        if (docs.length > 0) {
            console.log("Documento encontrado: ", docs);
            const imagen = docs[0].imagen; // obtenemos el correo electrónico del primer documento encontrado
            const mensaje = `La imagen del usuario es ${imagen}`; // concatenamos la cadena con el correo electrónico

            //res.status(200).json({email: docs[0].correo});
            console.log(docs[0].imagen);
            //var image = docs[0].imagen;
            const image = await modeloImagen.findById(docs[0].imagen);

            return image;

        } else {
            console.log('No se encontró el documento');
            return null;
            //res.status(500).json({ error: 'Error al buscar el usuario',  nombreUser: req.body.username });
        }
    } catch (error) {
        console.error(error);
        return 2;
        return null;
        //res.status(500).json({ error: 'Error al buscar el usuario', nombreUser: req.body.username });
    } finally {
        mongoose.disconnect();
        w.logger.info("DisConnected to MongoDB Atlas")
    }
}




module.exports = { registerUser, loginUser, deleteUser, updatePassword, updateCorreo, updateUsername, infoUsuario, devolverImagenPerfil };