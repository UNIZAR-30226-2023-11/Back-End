var config = require('../config/config');
var modeloUser = require('../models/userModel')
const  mongoose = require("mongoose");

async function registerUser(req, res){
    console.log("***POST METHOD Creacion de Usuario");

    const doc = new modeloUser({
        nombreUser: req.body.username,
        correo: req.body.email,
        contraseña: req.body.password,
        //contraseñaDos: req.body.confirm_password,
        imagen: "url",
        monedas: 0,
        victorias: 0,
        partidasJugadas: 0,
        productosComprados: 0,
        partidasEnJuego: 0
    });

    // const docs = await modeloUser.find(doc);
    // if (docs.length > 0) {
    //     //Existe el usuario
    //     res.status(400).json({message: 'Ya existe el usuario'});
    // } else{
        try {
            if(doc.contraseña == req.body.confirm_password){
                await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
                console.log("Connected to MongoDB Atlas")

                await doc.save();
                console.log('Documento guardado correctamente')
                res.status(201).json({message: 'Usuario creado correctamente'})
            }else{
                res.status(400).json({message: 'Contenido Invalido Passwords Distintas', contraseña: req.body.password,  contraseñaDos: req.body.confirm_password})
            }
        }
        catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error al crear usuario', nombreuser: req.body.username, correo: req.body.email, contraseña: req.body.password});
        }finally {
            mongoose.disconnect();
        }
    // }
}

async function loginUser(req, res){
    console.log("***GET METHOD Login");

    const doc = {
        nombreUser: req.body.username, 
        contraseña: req.body.password
    };

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        const docs = await modeloUser.find(doc);
      
        if (docs.length > 0) {
          console.log("Documento encontrado: ", docs);
          res.status(200).send('El usuario ha iniciado sesión correctamente');
        } else {
          console.log('No se encontró el documento');
          res.status(500).json({ error: 'Error usuario o contraseña incorrectos',  nombreUser: req.body.username, contraseña: req.body.password });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al buscar el usuario', nombreUser: req.body.username });
    }finally {
        mongoose.disconnect();
    }
}

async function deleteUser(req, res){
    console.log("***DELETE METHOD Eliminación de Usuario");
    const doc = { nombreUser: req.body.username};

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        const docs = await modeloUser.find(doc);
  
        // if (docs.length == 0) {
        //   //Existe el usuario
        //   res.status(400).json({message: 'No existe el usuario'});
        // }else{ 
            const result = await modeloUser.deleteOne(doc); 
            if (result.deletedCount === 1) {
                console.log("Se ha eliminado correctamenre");
                res.status(200).json({message: 'Usuario eliminado correctamente'})
            } else {
                console.log("No habia ningún usuario con esos datos.");
                res.status(400).json({error: 'Error al eliminar usuario. Bad Request'});
            }
        //}
    }catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el usuario', nombreuser: req.body.username });
    } finally {
        mongoose.disconnect();
    }
}

async function updatePassword(req, res){
    console.log("***PUT METHOD Actualizar la contraseña");

    const doc = {
        nombreUser: req.body.username, 
        contraseña: req.body.password,
        contraseñaDos: req.body.confirm_password
    };
  
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        //const docs = await modeloUser.find(doc);
        const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser},  { $set: { contraseña: doc.contraseña }})
        
        if(result.modifiedCount == 1) {
            console.log(result);
            console.log("Se ha actualizado la contraseña correctamente");
            res.status(200).json("Se ha actualizado la contraseña correctamente"); 
        }else {
            //console.error(error);
            console.log(result);
            //TODO:Probar que si se quita este lo coge el otro
            res.status(500).json({ error: 'Error al actualizar la contraseña 3', nombreUser: req.body.username, res: result });
        }
           
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la contraseña', nombreUser: req.body.username, res: result  });
    }
    finally {
        mongoose.disconnect();
    }
}

async function updateCorreo(req, res){
    console.log("***PUT METHOD Actualizar el correo");

    const doc = {
        nombreUser: req.body.username, 
        correo: req.body.correo,
    };
  
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        //const docs = await modeloUser.find(doc);
        const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser},  { $set: { correo: doc.correo }})
        if(result.modifiedCount == 1) {
            console.log(result);
            console.log("Se ha actualizado el correo correctamente");
            res.status(200).json("Se ha actualizado el correo correctamente"); 
        }else {
            //console.error(error);
            console.log(result);
            //TODO:Probar que si se quita este lo coge el otro
            res.status(500).json({ error: 'Error al actualizar el correo 3', nombreUser: req.body.username, res: result });
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar el correo', nombreUser: req.body.username });
    }finally {
        mongoose.disconnect();
    }
}

async function updateUsername(req, res){
    console.log("***PUT METHOD Actualizar el correo");

    const doc = {
        nombreUser: req.body.username, 
        newnombreUser: req.body.newusername,
    };

    // if(findUser(doc.newnombreUser) == 0){
        try {
            await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
            console.log("Connected to MongoDB Atlas");
        
            //const docs = await modeloUser.find(doc);
            const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser},  { $set: { nombreUser: doc.newnombreUser }})
            if(result.modifiedCount == 1) {
                console.log(result);
                console.log("Se ha actualizado el nombre de usuario correctamente");
                res.status(200).json("Se ha actualizado el nombre de usuario correctamente"); 
            }else {
                //console.error(error);
                console.log(result);
                //TODO:Probar que si se quita este lo coge el otro
                res.status(500).json({ error: 'Error al actualizar el nombre de usuario 3', nombreUser: req.body.username, res: result });
            }            
            
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el nombre de usuario', nombreUser: req.body.username });
        }finally {
            mongoose.disconnect();
        }
    // } else {
    //     console.error(error);
    //         res.status(412).json({ error: 'Error al actualizar el nombre de usuario', nombreUser: req.body.username });
    // }
}

async function findUser(req){
    console.log("***GET METHOD Encontrar Usuario");

    const doc = {nombreuser: req};
  
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        const docs = await modeloUser.find(doc);
      
        if (docs.length > 0) {
          console.log("Documento encontrado: ", docs);
          //res.status(200).send('El usuario ha iniciado sesión correctamente');
          return 1;
        } else {
          console.log('No se encontró el documento');
          //res.status(500).json({ error: 'Error el usuario no esta creado' });
          return 0;
        }
    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Error al buscar el usuario', nombreuser: req.body.username });
        return 0;
    }finally {
        mongoose.disconnect();
    }
}

async function leerUser(req, res, next){
    console.log("***POST METHOD Lectura de Usuario");

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas")

        await modeloUser.find();
        console.log('Usuario leido correcctamente')
        res.status(200).json({message: 'Usuario creado correctamente'})
    }
    catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al leer usuario'});
    }finally {
        mongoose.disconnect();
    }
}

module.exports = {registerUser, loginUser, deleteUser, updatePassword, updateCorreo, updateUsername};
