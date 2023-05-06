const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);
const w = require('./winston')
const g = require('./mensajes')

var usersController = require('./controllers/usersController');

// Declara un objeto para guardar las conexiones
const clientes = {};
var num = 0;
io.on('connection', (socket) => {
  w.logger.verbose('Usuario conectado');
  w.logger.verbose('Numero de usuarios conectados ' + num);
  io.emit('mensaje', 'Bienvenido al servidor Socket.IO');
  num++;
  // Guarda la conexión en el objeto connections
  const name = socket.handshake.query.name;
  //clientes[socket.id] = socket;

  // // Guarda la conexión en el objeto clientes junto con el nombre de usuario
  clientes[socket.id] = {
    socket: socket,
    username: name // aquí puedes inicializar el nombre de usuario con null
    //otherData: '...'
  };
  w.logger.verbose('Se ha conectado el usuario: ' + clientes[socket.id].socket.id + ' ' + clientes[socket.id].username);

  socket.on('login', async (data, ack) => {
    const socketId = data.socketId;
    w.logger.verbose('INICIO DE SESION ' + socketId);
    var login = await usersController.loginUser(data.username, data.password);

    if (login != 1 && login != 2) {
      w.logger.verbose('Usuario ha iniciado sesion correctamente\n', data.username);
      //io.to(socketId).emit('mensaje', 'Usuario ha iniciado sesion correctamente');
      clientes[socketId].username = data.username;
      //ack('0 Ok');
    }
    var m = {
      cod: login,
      msg: g.generarMsg(login, "Credenciales incorrectas")
    }
    //ack(login + msg);
    ack(m);
  });

  socket.on('nombreInvitado', async (data, ack) => {
    const socketId = data.socketId;
    w.logger.verbose('Invitado ' + socketId);

    clientes[socketId].username = data.username;
    var m = {
      cod: 0,
      msg: g.generarMsg(0, "")
    }
    //ack(login + msg);
    ack(m);
  });

  socket.on('register', async (data, ack) => {
    w.logger.verbose('REGISTRO DE USUARIO');
    const socketId = data.socketId;
    var reg = await usersController.registerUser(data.username, data.password, data.confirm_password, data.email);

    if (reg != 1 && reg != 2) {
      w.logger.verbose('Usuario se ha registrado correctamente');
      io.to(socketId).emit('mensaje', 'Usuario se ha registrado correctamente');
      clientes[socketId].username = data.username;
    }
    var m = {
      cod: reg,
      msg: g.generarMsg(reg, "")
    }
    //ack(login + msg);
    ack(m);
  });

  socket.on('deleteUser', async (data, ack) => {
    w.logger.verbose('Eliminacion de usuario');
    const socketId = data.socketId;
    var del = await usersController.deleteUser(clientes[socketId].username);

    if (del != 1 && del != 2) {
      w.logger.verbose('Usuario se ha eliminado correctamente');
      //ack('0 Ok');
      //io.to(socketId).emit('mensaje', 'Usuario se ha eliminado correctamente');
    }
    var m = {
      cod: del,
      msg: g.generarMsg(del, "")
    }
    ack(m);
  });

  socket.on('updateCorreo', async (data, ack) => {
    w.logger.verbose('Actualización del correo');
    const socketId = data.socketId;
    var up = await usersController.updateCorreo(clientes[socketId].username, data.email);
    if (up != 1 && up != 2) {
      w.logger.verbose('Usuario se ha actualizado el correo correctamente');
      //io.to(socketId).emit('mensaje', 'Usuario se ha actualizado el correo correctamente');
      //ack('0 Ok');
    }
    var m = {
      cod: up,
      msg: g.generarMsg(up, "")
    }
    ack(m);
  });

  socket.on('updatePassword', async (data, ack) => {
    w.logger.verbose('Actualización de contraseña');
    const socketId = data.socketId;
    var up = await usersController.updatePassword(clientes[socketId].username, data.password, data.confirm_password);

    if (up != 1 && up != 2) {
      w.logger.verbose('Usuario se ha actualizado la contraseña correctamente');
      //io.to(socketId).emit('mensaje', 'Usuario se ha actualizado el correo correctamente');

    }
    var m = {
      cod: up,
      msg: g.generarMsg(up, "")
    }
    ack(m);
  });

  //CORRECTA
  socket.on('updateUsername', async (data, ack) => {
    w.logger.verbose('Actualización del nombre de usuario');
    const socketId = data.socketId;
    var up = await usersController.updateUsername(clientes[socketId].username, data.newusername);
    if (up != 1 && up != 2) {
      w.logger.verbose('Actualizado nombre de usuario');
      io.emit('mensaje', "Actualizado nombre de usuario");
      clientes[socket.id].username = data.newusername;
      //ack('0 Ok');
    }
    var m = {
      cod: up,
      msg: g.generarMsg(up, "")
    }
    ack(m);
  });

  //CORRECTA
  socket.on('correo', async (data, ack) => {
    w.logger.verbose('Obtener el correo de un usuario');
    const socketId = data.socketId;
    //var correo =   await usersController.devolverCorreo(data.username);
    var correo = await usersController.devolverCorreo(clientes[socketId].username);
    var msg;
    if (correo != 1 && correo != 2) {
      w.logger.verbose('Correo obtenido:' + correo);
      //io.emit('mensaje', correo);
      //ack('0 Ok' + correo)
      msg = correo;
      correo = 0;
    }
    var m = {
      cod: correo,
      msg: g.generarMsg(correo, msg)
    }
    ack(m);
  });


  // Prueba
  socket.on('imagenPerfil', async (data, ack) => {
    w.logger.verbose('Obtener la imagen de perfil del usuario');
    const socketId = data.socketId;
    //var correo =   await usersController.devolverCorreo(data.username);
    var imagen = await usersController.devolverImagenPerfil(clientes[socketId].username);
    var msg;
    if (imagen != 1 && imagen != 2) {
      w.logger.verbose('Imagen obtenida:' + imagen);
      //io.emit('mensaje', correo);
      //ack('0 Ok' + correo)
      msg = imagen;
      imagen = 0;
    }
    w.logger.verbose(imagen);
    var m = {
      cod: imagen,
      msg: g.generarMsg(imagen, msg)
    }
    w.logger.verbose(m);
    ack(m);
  });


  // Escucha el evento 'disconnect'
  socket.on('disconnect', () => {
    w.logger.verbose('Usuario desconectado');
    w.logger.verbose('Se ha desconectado el usuario: ' + clientes[socket.id].socket.id + ' ' + clientes[socket.id].username);

    // Elimina la conexión del objeto connections
    delete clientes[socket.id];
    num--;
    w.logger.verbose('Numero de usuarios conectados ' + num);
  
  });

});

server.listen(3000, () => {
  w.logger.info('Servidor escuchando en el puerto 3000');
});