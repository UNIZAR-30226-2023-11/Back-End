const io = require('socket.io-client');
//const socket = io('http://localhost:3000');
const socket = io('http://localhost:3000', {
  query: {
    name: 'patricioNUEVO'
  }
});

const args = process.argv.slice(1);
console.log(args[1]); // ['foo', 'bar']


socket.on('connect', () => {

  console.log('Conectado al servidor');

  if (args[1] == 'login') {
    socket.emit('login', {
      username: 'clarita',
      password: 'clarita12',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  }else if (args[1] == 'nombreInvitado') {
    socket.emit('nombreInvitado', {
      username: 'mecachis',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  }else if (args[1] == 'register') {
    socket.emit('register', {
      username: 'paco',
      password: 'pacos',
      confirm_password: 'pacos',
      email: 'paco@unizar.es',
      socketId: socket.id

    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  } else if (args[1] == 'delete') {
    socket.emit('deleteUser', {
      //username: 'patricio2',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  } else if (args[1] == 'updatePassword') {
    socket.emit('updatePassword', {
      //username: 'patricioEstrella',
      password: 'patricioStar3',
      confirm_password: 'takatapro',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  } else if (args[1] == 'updateCorreo') {
    socket.emit('updateCorreo', {
      //username: 'patricioEstrella',
      email: 'laostia@gmail.com',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  } else if (args[1] == 'updateUsername') {
    socket.emit('updateUsername', {
      //username: 'patricio',
      newusername: 'patricioCORRECAMINOS',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  } else if (args[1] == 'correo') {
    socket.emit('correo', {
      //username: 'patricio',
      socketId: socket.id
    }, (ack) => {
      console.log('Server acknowledged:', ack);
    });
  }
});

socket.on('mensaje', (mensaje) => {
  console.log('Mensaje recibido: ' + mensaje);
});

socket.on('disconnect', () => {
  console.log('Desconectado del servidor');
});