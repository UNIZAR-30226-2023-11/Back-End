var config = require('../config/config');
var modeloUser = require('../models/userModel')
const  mongoose = require("mongoose");

async function registerUser(username,password, confirm_password, email){
    console.log("***POST METHOD Creacion de Usuario");

    const doc = new modeloUser({
        nombreUser: username,
        correo: email,
        contraseña: password,
        //contraseñaDos: req.body.confirm_password,
        imagen: "url",
        monedas: 0,
        victorias: 0,
        partidasJugadas: 0,
        productosComprados: 0,
        partidasEnJuego: 0
    });

        try {
            if(doc.contraseña == confirm_password){
                await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
                console.log("Connected to MongoDB Atlas")

                const filtro = { nombreUser: doc.nombreUser };
                const docs = await modeloUser.find(filtro);
      
                if (docs.length > 0) {
                  console.log("Documento encontrado: ", docs);
                  return 3;
                  //res.status(200).send('El usuario ha iniciado sesión correctamente');
                } else {
                  console.log('No se encontró el documento');
                  await doc.save();
                  console.log('Documento guardado correctamente')
                  return 0;
                  //res.status(500).json({ error: 'Error usuario o contraseña incorrectos',  nombreUser: req.body.username, contraseña: req.body.password });
                }
                //res.status(201).json({message: 'Usuario creado correctamente'})
            }else{
                return 1;
                //res.status(400).json({message: 'Contenido Invalido Passwords Distintas', contraseña: req.body.password,  contraseñaDos: req.body.confirm_password})
            }
        }
        catch (error) {
            console.error(error);
            return 2;
            //res.status(500).json({error: 'Error al crear usuario', nombreuser: req.body.username, correo: req.body.email, contraseña: req.body.password});
        }finally {
            mongoose.disconnect();
            console.log("DisConnected to MongoDB Atlas")
        }
    // }
}

async function loginUser(username, password){
    console.log("***GET METHOD Login");

    const doc = {
        nombreUser: username, 
        contraseña: password
    };

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        const docs = await modeloUser.find(doc);
      
        if (docs.length > 0) {
          console.log("Documento encontrado: ", docs);
          return 0;
          //res.status(200).send('El usuario ha iniciado sesión correctamente');
        } else {
          console.log('No se encontró el documento');
          return 1;
          //res.status(500).json({ error: 'Error usuario o contraseña incorrectos',  nombreUser: req.body.username, contraseña: req.body.password });
        }
    } catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({ error: 'Error al buscar el usuario', nombreUser: req.body.username });
    }finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

async function deleteUser(username){
    console.log("***DELETE METHOD Eliminación de Usuario");
    const doc = { nombreUser: username};

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
        const docs = await modeloUser.find(doc);
  
            const result = await modeloUser.deleteOne(doc); 
            if (result.deletedCount === 1) {
                console.log("Se ha eliminado correctamenre");
                return 0;
                //res.status(200).json({message: 'Usuario eliminado correctamente'})
            } else {
                console.log("No habia ningún usuario con esos datos.");
                return 1;
                //res.status(400).json({error: 'Error al eliminar usuario. Bad Request'});
            }
        //}
    }catch (error) {
        console.error(error);
        return 2;
        //res.status(500).json({ error: 'Error al eliminar el usuario', nombreuser: req.body.username });
    } finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

async function updatePassword(username, password, confirm_password){
    console.log("***PUT METHOD Actualizar la contraseña");

    const doc = {
        nombreUser: username, 
        contraseña: password,
        contraseñaDos: confirm_password
    };
  
    console.log(doc);
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        //const docs = await modeloUser.find(doc);
        const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser, contraseña: doc.contraseña},  { $set: { contraseña: doc.contraseñaDos }})
        
        if(result.modifiedCount == 1) {
            console.log(result);
            console.log("Se ha actualizado la contraseña correctamente");
            return 0;
            //res.status(200).json("Se ha actualizado la contraseña correctamente"); 
        }else {
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
        console.log("DisConnected to MongoDB Atlas")
    }
}

async function updateCorreo(username, email){
    console.log("***PUT METHOD Actualizar el correo");

    const doc = {
        nombreUser: username, 
        correo: email,
    };
  
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        //const docs = await modeloUser.find(doc);
        const result = await modeloUser.updateOne({ nombreUser: doc.nombreUser},  { $set: { correo: doc.correo }})
        if(result.modifiedCount == 1) {
            console.log(result);
            console.log("Se ha actualizado el correo correctamente");
            return 0;
            //res.status(200).json("Se ha actualizado el correo correctamente"); 
        }else {
            //console.error(error);
            console.log(result);
            return 1;
            //TODO:Probar que si se quita este lo coge el otro
           // res.status(500).json({ error: 'Error al actualizar el correo 3', nombreUser: req.body.username, res: result });
        }
        
    } catch (error) {
        console.error(error);
        return  2;
        //res.status(500).json({ error: 'Error al actualizar el correo', nombreUser: req.body.username });
    }finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

async function updateUsername(username, newusername){
    console.log("***PUT METHOD Actualizar el username");

    const doc = {
        nombreUser: username, 
        newnombreUser: newusername
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
                return 0;
                //res.status(200).json("Se ha actualizado el nombre de usuario correctamente"); 
            }else {
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
        }finally {
            mongoose.disconnect();
        }
}

async function devolverCorreo(username){
    console.log("***POST METHOD Devolver correo");
    console.log(username)
    const doc = {
        nombreUser: username
    };

    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        const docs = await modeloUser.find(doc);

        if (docs.length > 0) {
          console.log("Documento encontrado: ", docs);
          const correo = docs[0].correo; // obtenemos el correo electrónico del primer documento encontrado
          const mensaje = `El correo del usuario es ${correo}`; // concatenamos la cadena con el correo electrónico
          //res.status(200).json({email: docs[0].correo});
          console.log(docs[0].correo);
          var email = docs[0].correo;
          return email;
          
        } else {
          console.log('No se encontró el documento');
          return  1;
          //res.status(500).json({ error: 'Error al buscar el usuario',  nombreUser: req.body.username });
        }
    } catch (error) {
        console.error(error);
        return  2;
        //res.status(500).json({ error: 'Error al buscar el usuario', nombreUser: req.body.username });
    }finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
    }
}

async function findUser(req){
    console.log("***GET METHOD Encontrar Usuario");

    const doc = {id: req};
  
    try {
        await mongoose.connect(config.db.uri, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB Atlas");
      
        const docs = await modeloUser.find(doc);
      
        if (docs.length > 0) {
          console.log("Documento encontrado: ", docs);
          //res.status(200).send('El usuario ha iniciado sesión correctamente');
          return 0;
        } else {
          console.log('No se encontró el documento');
          //res.status(500).json({ error: 'Error el usuario no esta creado' });
          return 1;
        }
    } catch (error) {
        console.error(error);
        //res.status(500).json({ error: 'Error al buscar el usuario', nombreuser: req.body.username });
        return 2;
    }finally {
        mongoose.disconnect();
        console.log("DisConnected to MongoDB Atlas")
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
        console.log("DisConnected to MongoDB Atlas")
    }
}

module.exports = {registerUser, loginUser, deleteUser, updatePassword, updateCorreo, updateUsername, devolverCorreo};
