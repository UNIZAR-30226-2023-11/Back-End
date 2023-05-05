const WebSocket = require('websocket').client;

const client = new WebSocket();

client.on('connect', function connection(ws) {
  console.log('Conectado al servidor');

  // Enviar un mensaje de login al servidor
  ws.send(JSON.stringify({
    type: 'login',
    username: 'lucia',
    password: 'lucia'
  }));
});

client.connect('ws://localhost:8080/');

client.on('connect', function(ws) {
    console.log('Conectado al servidor');
  
    // Enviar un mensaje de login al servidor
    ws.send(JSON.stringify({
      type: 'login',
      username: 'lucia',
      password: 'lucia'
    }));
  });