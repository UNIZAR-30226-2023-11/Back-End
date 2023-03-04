//var c = require('mongodb');
//import { MongoClient } from "mongodb";
var db = require('../config/config.js');


//const MongoClient = require('mongodb').MongoClient;

// Replace the uri string with your MongoDB deployment's connection string.

//const client = new c.MongoClient(db.uri);
const  mongoose = require("mongoose");


//const myDB = client.db(db.database);
//const myColl = myDB.collection(db.colUsers);

    
var conn = mongoose.connection;

async function createUser(req, res, next){
    console.log("***POST METHOD Creacion de Usuario");

    // if(!req.body.email || !req.body.contraseña){
    //     res.status(400).send('Faltan datos');
    // }else{
        
                // Connect MongoDB Atlas using mongoose connect method
           
            const doc = { name: "Neapolitan pizza", shape: "round" };
            const result = await conn.collection(db.colUsers).insertOne(doc);
            console.log(
            `A document was inserted with the _id: ${result.insertedId}`,
            );
            res
            .status(201)
            .send('Nueva cancion añadidacon titulo ' + req.body.titulo);
        
        
   // }
    console.log(JSON.stringify(req.body));
    //{"Titulo": }

    
    }


     
      

module.exports = {createUser};