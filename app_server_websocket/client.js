const io = require('socket.io-client');
const socket = io('http://localhost:3000');

const args = process.argv.slice(1);
console.log(args[1]); // ['foo', 'bar']


socket.on('connect', () => {
  console.log('Conectado al servidor');
  if (args[1] == 'login') {
    socket.emit('login', {
      username: 'clarita',
      password: 'clarita12',
      socketId: socket.id
    });
  }else if(args[1]=='register'){
    socket.emit('register', {
      username: 'patricio',
      password: 'patricioStar',
      confirm_password: 'patricioStar',
      email: 'pestrella@unizar.es',
      socketId: socket.id
  
    });
  }else if(args[1]=='delete'){
    socket.emit('deleteUser', {
      username: 'patricio',
      socketId: socket.id
    });
  }else if(args[1]=='updateCorreo'){
    socket.emit('updateCorreo', {
      username: 'patricio',
      email: 'laostia@gmail.com',
      socketId: socket.id
    });
  }else if(args[1]=='updateUsername'){
    socket.emit('updateUsername', {
      username: 'patricio',
      newusername: 'patricioEstrella',
      socketId: socket.id
    });
  }else if(args[1]=='correo'){
    socket.emit('correo', {
      username: 'patricioEstrella',
      socketId: socket.id
    });
  }
});

socket.on('mensaje', (mensaje) => {
  console.log('Mensaje recibido: ' + mensaje);
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});


socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});