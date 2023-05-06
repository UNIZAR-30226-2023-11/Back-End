const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

var usersController = require('./controllers/usersController');
const winston = require('winston');
const { format } = require('logform');

const alignedWithColorsAndTime = format.combine(
  format.colorize(),
  format.timestamp(),
  format.align(), 
  format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
);
//con colores winston.format.cli()
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'silly',
    format: alignedWithColorsAndTime,
    transports: [new winston.transports.Console()],
  });


function generarMsg(codigo, msg){
  switch (codigo) {
    case 0:
      return msg || 'Ok';
      break;
    case 1:
      return "No se ha encontrado el valor o no se ha modificado nada";
      break;
    case 2:
      return "Error en la función"
      break;
    case 3:
      return "Ya hay un usuario con ese nombre"
      break;
    default:
      return "";
  }
}
// Declara un objeto para guardar las conexiones
const clientes = {};

io.on('connection', (socket) => {
  logger.verbose('Usuario conectado');
  io.emit('mensaje', 'Bienvenido al servidor Socket.IO');
  
  // Guarda la conexión en el objeto connections
  const name = socket.handshake.query.name;
  //clientes[socket.id] = socket;
    
  // // Guarda la conexión en el objeto clientes junto con el nombre de usuario
    clientes[socket.id] = {
      socket: socket,
      username: name // aquí puedes inicializar el nombre de usuario con null
      //otherData: '...'
    };
    logger.verbose('Se ha conectado el usuario: ' + clientes[socket.id].socket.id + ' ' + clientes[socket.id].username );

  socket.on('login', async(data, ack) => {
    const socketId = data.socketId; 
    logger.verbose('INICIO DE SESION ' + socketId);
    var login = await usersController.loginUser(data.username, data.password);
    
    if (login != 1 && login !=2 ) {
      logger.verbose('Usuario ha iniciado sesion correctamente');
      //io.to(socketId).emit('mensaje', 'Usuario ha iniciado sesion correctamente');
      clientes[socketId].username = data.username;
      //ack('0 Ok');
    } 
    var m = {
      cod : login,
      msg : generarMsg(login,"")
    }
    //ack(login + msg);
    ack(m);
  
  });

  socket.on('register', async(data, ack) => {
    logger.verbose('REGISTRO DE USUARIO');
    const socketId = data.socketId; 
    var reg = await usersController.registerUser(data.username, data.password, data.confirm_password, data.email);
  
    if (reg != 1 && reg !=2 ) {
      logger.verbose('Usuario se ha registrado correctamente');
      io.to(socketId).emit('mensaje', 'Usuario se ha registrado correctamente');
      clientes[socketId].username = data.username;
    }
    var m = {
      cod : reg,
      msg : generarMsg(reg, "")
    }
    //ack(login + msg);
    ack(m);
  });

  socket.on('deleteUser', async(data, ack) => {
    logger.verbose('Eliminacion de usuario');
    const socketId = data.socketId;
    var del = await usersController.deleteUser(clientes[socketId].username);
  
    if (del != 1 && del !=2 ) {
      logger.verbose('Usuario se ha eliminado correctamente');
      //ack('0 Ok');
      //io.to(socketId).emit('mensaje', 'Usuario se ha eliminado correctamente');
    }
    var m = {
      cod : del,
      msg : generarMsg(del, "")
    }
    ack(m);
  });

  socket.on('updateCorreo', async(data, ack) => {
    logger.verbose('Actualización del correo');
    const socketId = data.socketId;
    var up = await usersController.updateCorreo(clientes[socketId].username, data.email);
    if (up != 1 && up !=2 ) {
      logger.verbose('Usuario se ha actualizado el correo correctamente');
      //io.to(socketId).emit('mensaje', 'Usuario se ha actualizado el correo correctamente');
      //ack('0 Ok');
    }
    var m = {
      cod : up,
      msg : generarMsg(up, "")
    }
    ack(m);
  });

  socket.on('updatePassword', async(data, ack) => {
    logger.verbose('Actualización de contraseña');
    const socketId = data.socketId;
    var up = await usersController.updatePassword(clientes[socketId].username, data.password, data.confirm_password);

    if (up != 1 && up !=2 ) {
      logger.verbose('Usuario se ha actualizado la contraseña correctamente');
      //io.to(socketId).emit('mensaje', 'Usuario se ha actualizado el correo correctamente');

    }
    var m = {
      cod : up,
      msg : generarMsg(up, "")
    }
    ack(m);
  });

  //CORRECTA
  socket.on('updateUsername', async (data, ack) => {
    logger.verbose('Actualización del nombre de usuario');
    const socketId = data.socketId;
    var up = await usersController.updateUsername(clientes[socketId].username, data.newusername);
    if(up != 1 && up !=2){
      logger.verbose('Actualizado nombre de usuario');
      io.emit('mensaje', "Actualizado nombre de usuario");
      clientes[socket.id].username = data.newusername;
      //ack('0 Ok');
    }
    var m = {
      cod : up,
      msg : generarMsg(up, "")
    }
    ack(m);
  });

  //CORRECTA
  socket.on('correo', async (data, ack ) => {
    logger.verbose('Obtener el correo de un usuario');
    const socketId = data.socketId;
    //var correo =   await usersController.devolverCorreo(data.username);
    var correo =   await usersController.devolverCorreo(clientes[socketId].username);
    var msg;
    if (correo != 1 && correo !=2) {
      logger.verbose('Correo obtenido:' + correo);
      //io.emit('mensaje', correo);
      //ack('0 Ok' + correo)
      msg = correo;
      correo = 0;
    }
    var m = {
      cod : correo,
      msg : generarMsg(correo, msg)
    }
    ack(m);
  });


  // Escucha el evento 'disconnect'
  socket.on('disconnect', () => {
    logger.verbose('Usuario desconectado');
    logger.verbose('Se ha desconectado el usuario: ' + clientes[socket.id].socket.id + ' ' + clientes[socket.id].username );

    // Elimina la conexión del objeto connections
    delete clientes[socket.id];
  });

});

server.listen(3000, () => {
  logger.info('Servidor escuchando en el puerto 3000');
});