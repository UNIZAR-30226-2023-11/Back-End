const WebSocket = require('ws');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
var usersRouter = require('./routes/users');
var partidaRouter = require('./routes/partida');
var usersController = require('./controllers/usersController');
const app = express();
//const apiPort = 8080;
const Server = new WebSocket.Server({
  port: 8080
});

// let sockets = [];
// server.on('connection', function(socket) {
//     sockets.push(socket);


// Mantener un registro de los clientes conectados
const clients = new Set();

Server.on('connection', function connection(wss) {
  console.log('Nuevo cliente conectado');

  // Agregar el nuevo cliente a la listaF
  clients.add(wss);

  // Manejar mensajes entrantes del cliente
  //   ws.on('message', function incoming(message) {
  //     console.log(`Mensaje recibido: ${message}`);
  //   });
  Server.on('login', function login(username, password) {
    console.log("INICIO DE SESION");
    usersController.loginUser(username, password);
  });

  // Manejar la desconexión del cliente
  Server.on('close', function close() {
    console.log('Cliente desconectado');

    // Eliminar el cliente de la lista
    clients.delete(wss);
  });
});

  // When you receive a message, send that message to every socket.
//   socket.on('message', function(msg) {
//     sockets.forEach(s => s.send(msg));
//   });

//   // When a socket closes, or disconnects, remove it from the array.
//   socket.on('close', function() {
//     sockets = sockets.filter(s => s !== socket);
//   });
// });



// app.use(express.static(path.join(__dirname, 'public')));
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(cors());
// app.use(bodyParser.json());

// // app.get('/', (req, res) => {
// //     res.send('Monopoly versión informática - Susan L. Graham');
// // })

// app.get('/', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// app.use('/users', usersRouter);
// app.use('/partida', partidaRouter)


// app.listen(apiPort, () => console.log(`Server running on port ${apiPort}`));
