const http = require('http');
const server = http.createServer();
const io = require('socket.io')(server);

var usersController = require('./controllers/usersController');
// Declara un objeto para guardar las conexiones
const clientes = {};

io.on('connection', (socket) => {
  console.log('Usuario conectado');
  io.emit('mensaje', 'Bienvenido al servidor Socket.IO');
  
  // Guarda la conexión en el objeto connections
  clientes[socket.id] = socket;
    
  // // Guarda la conexión en el objeto clientes junto con el nombre de usuario
  //   clientes[socket.id] = {
  //     socket: socket,
  //     username: null, // aquí puedes inicializar el nombre de usuario con null
  //     otherData: '...'
  //   };


  socket.on('login', async(data) => {
    const socketId = data.socketId; 
    console.log('INICIO DE SESION ', socketId);
    var login = await usersController.loginUser(data.username, data.password);
    
    if (login) {
      console.log('Usuario ha iniciado sesion correctamente');
      io.to(socketId).emit('mensaje', 'Usuario ha iniciado sesion correctamente');
    } else {
      
      io.to(socketId).emit('mensaje', "No existe el usuario");
    }
  
  });

  socket.on('register', async(data) => {
    console.log('REGISTRO DE USUARIO');
    await usersController.registerUser(data.username, data.password, data.confirm_password, data.email);
  });

  socket.on('deleteUser', async(data) => {
    console.log('Eliminacion de usuario');
    await usersController.deleteUser(data.username);
  });

  socket.on('updateCorreo', async(data) => {
    console.log('Actualización del correo');
   await usersController.updateCorreo(data.username, data.email);

  });

  socket.on('updateUsername', async (data) => {
    console.log('Actualización del nombre de usuario');
    await usersController.updateUsername(data.username, data.newusername);
  });

  socket.on('correo', async (data) => {
    console.log('Obtener el correo de un usuario');
    var correo =   await usersController.devolverCorreo(data.username);
    if (correo) {
      console.log('Correo actualizado:', correo);
      io.emit('mensaje', correo);
    } else {
      
      io.emit('mensaje', "No existe el correo");
    }
  });


  // Escucha el evento 'disconnect'
  socket.on('disconnect', () => {
    console.log('Usuario desconectado');
    // Elimina la conexión del objeto connections
    delete clientes[socket.id];
  });

});

server.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});