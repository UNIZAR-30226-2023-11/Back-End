const http = require('http');
// const server = http.createServer();
const server = http.createServer((req, res) => {
  res.write('Hello, world!');
  res.end();
});
const io = require('socket.io')(server);
const w = require('./winston')
const g = require('./mensajes')

var usersController = require('./controllers/usersController');
var partidaController = require('./controllers/partidaController');
var tiendaController = require('./controllers/tiendaController');
var asignaturasController = require('./controllers/asignaturasController');
var cartasController = require('./controllers/cartasController');
// Declara un objeto para guardar las conexiones
var clientes = {};

const socketToGroupMap = new Map(); // Mapa para mantener un registro de los sockets y los grupos a los que están unidos

var num = 0;
io.on('connection', (socket) => {
  // w.logger.verbose('Usuario conectado');
  
  var long = clientes.legth;
  // w.logger.verbose("NUMERO DE USUARIOS CONECTADOS: ", long);
  
  num++;
  // w.logger.verbose('Numero de usuarios conectados ' + num);

  io.emit('mensaje', 'Bienvenido al servidor Socket.IO');
 
  // Guarda la conexión en el objeto connections
  // const name = socket.handshake.query.name;
  //clientes[socket.id] = socket;

  // // Guarda la conexión en el objeto clientes junto con el nombre de usuario
  // clientes[socket.id] = {
  //   socket: socket,
  //   username: "",
  //   partidaActiva: 0 // aquí puedes inicializar el nombre de usuario con null
  //   //otherData: '...'
  // };
  // w.logger.verbose('Se ha conectado el usuario: ' + clientes[socket.id].socket.id + ' ' + clientes[socket.id].username);

  socket.on('login', async (data, ack) => {
    if (data.socketId != null && data.username != null && data.password != null) {
      const socketId = data.socketId;
      w.logger.verbose('INICIO DE SESION ' , socketId);
      w.logger.debug('socketId: ' + socketId);
      var login = await usersController.loginUser(data.username, data.password);

      if (login != 1 && login != 2) {
        w.logger.verbose('Usuario ha iniciado sesion correctamente\n', data.username);
        //io.to(socketId).emit('mensaje', 'Usuario ha iniciado sesion correctamente');

        clientes[socketId] = {socket: socketId, username: data.username, partidaActiva: 0}
        // clientes[socketId].username = data.username;
        // clientes[socketId].socket = JSON.stringify(socketId);
        //ack('0 Ok');
      }
      var m = {
        cod: login,
        msg: g.generarMsg(login, "Credenciales incorrectas")
      }
      //ack(login + msg);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED")
    }
  });

  socket.on('nombreInvitado', async (data, ack) => {
    if (data.socketId != null && data.username != null){
      const socketId = data.socketId;
      w.logger.verbose('Invitado: ' ,  JSON.stringify(socketId));
      w.logger.verbose(`nombre: ${data.username}`)

      clientes[socketId] = {socket: socketId, username: data.username, partidaActiva: 0}
      // clientes[socketId].username = data.username;
      var m = {
        cod: 0,
        msg: g.generarMsg(0, "")
      }
      //ack(login + msg);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('register', async (data, ack) => {
    if (data.socketId != null && data.username != null && data.password != null && data.confirm_password != null && data.email != null) {
      w.logger.verbose('REGISTRO DE USUARIO');
      const socketId = data.socketId;
      var reg = await usersController.registerUser(data.username, data.password, data.confirm_password, data.email);

      if (reg != 1 && reg != 2) {
        w.logger.verbose('Usuario se ha registrado correctamente');
        io.to(socketId).emit('mensaje', 'Usuario se ha registrado correctamente');
        
        clientes[socketId] = {socket: socketId, username: data.username, partidaActiva: 0}
        // clientes[socketId].username = data.username;
        // clientes[socketId].socket = JSON.stringify(socketId);
      }
      var m = {
        cod: reg,
        msg: g.generarMsg(reg, "")
      }
      //ack(login + msg);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('deleteUser', async (data, ack) => {
    if (data.socketId != null) {
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

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('updateCorreo', async (data, ack) => {
    if (data.socketId != null && data.email != null) {
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

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('updatePassword', async (data, ack) => {
    if (data.socketId != null && data.password != null && data.confirm_password != null){
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

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  //CORRECTA
  socket.on('updateUsername', async (data, ack) => {
    if (data.socketId != null && data.newusername != null) {
      w.logger.verbose('Actualización del nombre de usuario');
      const socketId = data.socketId;
      var up = await usersController.updateUsername(clientes[socketId].username, data.newusername);
      if (up != 1 && up != 2) {
        w.logger.verbose('Actualizado nombre de usuario');
        io.emit('mensaje', "Actualizado nombre de usuario");
        clientes[socket.id].username = data.newusername;
        w.logger.error(clientes[socket.id].username);
        //ack('0 Ok');
      }
      var m = {
        cod: up,
        msg: g.generarMsg(up, "")
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('updateImagenPerfil', async (data, ack) => {
    if (data.socketId != null && data.imagen != null) {
      w.logger.verbose('Actualización de la imagen de perfil de usuario');
      const socketId = data.socketId;
      var up = await usersController.updateImagenPerfil(clientes[socketId].username, data.imagen);
      if (up != 1 && up != 2) {
        w.logger.verbose('Actualizada imagen de perfil');
        io.emit('mensaje', "Actualizada imagen de perfil");
        clientes[socket.id].imagen = data.imagen;
        w.logger.error(clientes[socket.id].imagen);
        //ack('0 Ok');
      }
      var m = {
        cod: up,
        msg: g.generarMsg(up, "")
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  //CORRECTA
  socket.on('infoUsuario', async (data, ack) => {
    const socketId = data.socketId;
    if (data.socketId != null && clientes[socketId].username != null) {
      //FIXME: HECHO  no devolver contraseña
      w.logger.verbose('Obtener la info de un usuario');
      w.logger.verbose(`SocketId: ${JSON.stringify(data.socketId)} `);
      
      var usuario = await usersController.infoUsuario(clientes[socketId].username);

      // var imagen = await usersController.devolverImagenPerfil(clientes[socketId].username);
      usuario.contraseña = "";
      var msg;
      if (usuario != 1 && usuario != 2) {
        w.logger.verbose('Usuario obtenido:' + usuario);
        msg = usuario;
        usuario = 0;
      }
      var m = {
        cod: usuario,
        msg: g.generarMsg(usuario, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });


  // Prueba
  // socket.on('imagenPerfil', async (data, ack) => {
  //   w.logger.verbose('Obtener la imagen de perfil del usuario');
  //   const socketId = data.socketId;
  //   var imagen = await usersController.devolverImagenPerfil(clientes[socketId].username);
  //   var msg;
  //   if (imagen != 1 && imagen != 2) {
  //     w.logger.verbose('Imagen obtenida:' + imagen.toString());
  //     msg = imagen;
  //     imagen = 0;
  //   }
  //   w.logger.verbose(imagen);
  //   var m = {
  //     cod: imagen,
  //     msg: g.generarMsg(imagen, msg)
  //   }
  //   w.logger.verbose(m);
  //   ack(m);
  // });





  // ==============================================
  // FUNCIONES DE PARTIDA
  // ==============================================

  io.of("/").adapter.on("create-room", (room) => {
    // w.logger.debug(`room ${room} was created`);
  });
  
  io.of("/").adapter.on("join-room", (room, id) => {
    // w.logger.debug(`socket ${id} has joined room ${room}`);
  });

  socket.on('crearPartida', async (data, ack) => {
    const socketId = data.socketId;
    
    if (data.socketId != null && clientes[socketId].username != null) {
      w.logger.verbose('Creación de una partida');
    
      //var correo =   await usersController.devolverCorreo(data.username);

      w.logger.verbose("USUARIO QUE QUIERE CREAR PARTIDA: "+  clientes[socketId].username);
      var partida = await partidaController.crearPartida( clientes[socketId].username, 0, 2, false)
      var msg = "";
      if (partida != 1 && partida != 2) {
        w.logger.verbose('Partida creada correctamente');
        //io.emit('mensaje', correo);
        //ack('0 Ok' + correo)
        w.logger.verbose("idPartida: "+ partida.id);
        msg = partida;
        w.logger.verbose("SocketId usuario que crea la partida: "+ JSON.stringify(socketId));
        
        clientes[socketId].partidaActiva = partida.id;

        // socketToGroupMap.set(socket.id, data.idPartida); // Registrar el ID del socket y el nombre del grupo en el mapa
        w.logger.debug("ROOM: " + partida.id);
        var idP = partida.id;
        socket.join(idP.toString()); // Unir el socket al grupo utilizando el nombre del grupo

        msg = partida;
        partida = 0;
      
        w.logger.verbose("\n\tCliente socket: " + (clientes[socketId].socket) + "\n" +
          "\tCliente nombre: " + clientes[socketId].username + "\n" +
          "\tCliente partida: " + clientes[socketId].partidaActiva + "\n");
      }
      //w.logger.verbose(imagen);
      var m = {
        cod: partida,
        msg: g.generarMsg(partida, msg)
      }
      w.logger.verbose("MENSAJE", m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });


  socket.on('actualizarPartida', async (data, ack) => {
    if (data.socketId != null && data.nJugadores != null && data.dineroInicial != null) {
      w.logger.verbose('Creación de una partida');
      const socketId = data.socketId;
      w.logger.verbose(`partidaActiva: ${clientes[socketId]}`);
      var partida = await partidaController.actualizarPartida(clientes[socketId].partidaActiva, data.nJugadores, data.dineroInicial);
      var msg = "";
      if (partida != 1 && partida != 2) {
        w.logger.verbose('Partida actualizada correctamente');

        w.logger.verbose("\n\tCliente socket: " + clientes[socketId].socket + "\n" +
          "\tCliente nombre: " + clientes[socketId].username + "\n" +
          "\tCliente partida: " + clientes[socketId].partidaActiva + "\n");

        if (data.jugar) {
          var p = await partidaController.findPartida(clientes[socketId].partidaActiva);
          var i = 0;
          Object.values(clientes).forEach(elemento => {
            i++;
            w.logger.verbose("CLIENTES " + i + " "  +  elemento.socket.toString() +  " " + elemento.partidaActiva.toString());
            w.logger.verbose("IDPARTIDA: " + p.id);
            if (elemento.partidaActiva == p.id) {
              //enviamos a ese jugador el evento aJugar
              var partUser = {
                partida: p,
                username: elemento.username
              }
              var sock = elemento.socket;
              w.logger.verbose("SOCKET DEL USER" + partUser.username + " " + sock.toString());
              io.to(sock.toString()).emit('comenzarPartida', partUser);
              // w.logger.debug(elemento.socket.id);
              w.logger.debug(elemento.socket);
            }
          });
          // var s = clientes[socketId].partidaActiva;

          // io.to(s.toString()).emit('comenzarPartida', {username: clientes[socketId].username, partida: p});
        }
      }
      //w.logger.verbose(imagen);
      //TODO: REVISAR - cuando jugar es true no dejas que mas users se unan y enviar mensajes a los demas de empezar partida
      var m = {
        cod: partida,
        msg: g.generarMsg(partida, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('unirJugador', async (data, ack) => {
    if (data.socketId != null && data.idPartida != null) {
      w.logger.verbose('Se une un jugador a una partida');
      const socketId = data.socketId;
      var partida = await partidaController.unirJugador(data.idPartida, clientes[socketId].username);

      var msg = "";
      if (partida != 1 && partida != 2 && partida != 4) {
        w.logger.verbose('Se ha unido correctamente el jugador');
        //io.emit('mensaje', correo);
        //ack('0 Ok' + correo)
        msg = partida;
        partida = 0;
        clientes[socketId].partidaActiva = data.idPartida;

        // socketToGroupMap.set(socket.id, data.idPartida); // Registrar el ID del socket y el nombre del grupo en el mapa
        var idP =  data.idPartida;
        socket.join(idP.toString()); // Unir el socket al grupo utilizando el nombre del grupo
            
        var partida = await partidaController.infoPartida(data.idPartida);

        w.logger.debug('Lista jugadores: ' , partida.nombreJugadores);

        w.logger.debug("Sockets del jugador que se ha unido: " , socket.id);
        w.logger.debug(`ROOM: ${clientes[socketId].partidaActiva}`);
        var idP = clientes[socketId].partidaActiva;
        io.to(idP.toString()).emit('esperaJugadores', partida.nombreJugadores);

        const socketsGrupo = io.sockets.in(data.idPartida).sockets;
        w.logger.debug(`IDs de los sockets en el grupo ${data.idPartida}:`);

        var i = 0;
        Object.values(clientes).forEach(elemento => {
          if(elemento.partidaActiva == data.idPartida){
            i++;
            w.logger.debug("Socket: " + i + " " + elemento.socket);
            // if(i ===2){
            //   w.logger.debug("Socket: " + i + " " + JSON.stringify(elemento.socket));
            // }

    
            // w.logger.debug("Socket.id: " + elemento.socket.id);
          }
        });

        w.logger.verbose("\n\tCliente socket: " + clientes[socketId].socket + "\n" +
          "\tCliente nombre: " + clientes[socketId].username + "\n" +
          "\tCliente partida: " + clientes[socketId].partidaActiva + "\n");

        // partida = 0;
      }
      //w.logger.verbose(imagen);
      var m = {
        cod: partida,
        msg: g.generarMsg(partida, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });



  //TODO: HAY QUE GESTIONAR LA SALIDA DE LOS GRUPOS SOCKET.LEAVE


  socket.on('lanzarDados', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Lanzamiento de dados');
      const socketId = data.socketId;
      // clientes[socketId].partidaActiva,
      var dados = await partidaController.lanzardados(clientes[socketId].partidaActiva, clientes[socketId].username);

      var msg = "";
      if (dados != 1 && dados != 2) {
        w.logger.verbose('Se han lanzado los dados correctamente');

        msg = dados;
        dados = 0;
        w.logger.debug('Dados: ' + dados);
      }
      //w.logger.verbose(imagen);
      var m = {
        cod: dados,
        msg: g.generarMsg(dados, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('siguienteTurno', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Siguiente turno');
      const socketId = data.socketId;
      /**/
      w.logger.verbose('PartidaActiva: ' , clientes[socketId]);
      // clientes[socketId].partidaActiva = 1;
      var turno = await partidaController.siguienteTurno(clientes[socketId].partidaActiva);
      var msg = "";
      if (turno != 1 && turno != 2) {
        w.logger.verbose('Se ha realizado siguiente turno correctamente');

        msg = turno;
        w.logger.debug('Turno: ' + JSON.stringify(turno));

        var s = clientes[socketId].partidaActiva;
        io.to(s.toString()).emit('turnoActual', turno);
        
        turno = 0;
      }
      var m = {
        cod: turno,
        msg: g.generarMsg(turno, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  // socket.on('comenzarPartida', async (data, ack) => {
  //   w.logger.verbose('comenzarPartida');
  //   const socketId = data.socketId;
  //   var partida = clientes[socketId].partidaActiva;
  //   w.logger.debug("Partida activa: " + partida);

  //   Object.values(clientes).forEach(elemento => {
  //     if (elemento.partidaActiva === partida) {
  //       enviamos a ese jugador el evento aJugar
  //       io.to(elemento.socket).emit('aJugar', elemento.username);
  //     }
  //   });

  // });


  // ==============================================
  // FUNCIONES DE ASIGNATURAS
  // ==============================================

  socket.on('infoAsignatura', async (data, ack) => {
    if (data.socketId != null && data.coordenadas != null) {
      w.logger.verbose('Info Asignatura');
      var coordenadas = data.coordenadas;
      var asignatura = await asignaturasController.infoAsignatura(coordenadas);

      var msg = "";
      if (asignatura != 1 && asignatura != 2) {
        w.logger.verbose('Se ha obtenido la informacion de la asignatura');

        msg = asignatura;
        w.logger.debug('asignatura: ' + asignatura);
        asignatura = 0;
      }
      var m = {
        cod: asignatura,
        msg: g.generarMsg(asignatura, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('casilla', async (data, ack) => {
    if (data.socketId != null && data.coordenadas) {
      w.logger.verbose('Casilla');
      const socketId = data.socketId;
      var coordenadas = data.coordenadas;

      var casilla = await asignaturasController.checkCasilla(clientes[socketId].username, coordenadas, clientes[socketId].partidaActiva)
      var msg = "";

      if (casilla === 5) {
        var partida = await partidaController.infoPartida(clientes[socketId].partidaActiva);
        msg = partida;
      }
      var m = {
        cod: casilla,
        msg: g.generarMsg(casilla, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('comprarCasilla', async (data, ack) => {
    if (data.socketId != null && data.coordenadas != null) {
      w.logger.verbose('Metodo de comprar casilla');
      const socketId = data.socketId;
      const coordenadas = data.coordenadas;
      var msg = "";
      var comprada = await asignaturasController.comprarCasilla(clientes[socketId].username, coordenadas, clientes[socketId].partidaActiva);
      const partida = await partidaController.infoPartida(clientes[socketId].partidaActiva)
      w.logger.debug ("partida:" + JSON.stringify(partida));

      var s = clientes[socketId].partidaActiva;
      io.to(s.toString()).emit('infoPartida', partida);
      var m = {
        cod: comprada,
        msg: g.generarMsg(comprada, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('listaAsignaturasC', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Lista de asignaturas compradas');
      const socketId = data.socketId;
      // clientes[socketId].partidaActiva = 32;
      var casillas = await asignaturasController.listaAsignaturasC(clientes[socketId].username, clientes[socketId].partidaActiva)
      var msg = "";
      if (casillas != 1) {
        msg = casillas;
        casillas = 0;
      }
      var m = {
        cod: casillas,
        msg: g.generarMsg(casillas, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('vender', async (data, ack) => {
    if (data.socketId != null && data.coordenadas != null) {
      w.logger.verbose('Vender asignatura');
      const socketId = data.socketId;
      var coordenadas = data.coordenadas;
      clientes[socketId].partidaActiva = 32;

      //TODO: ACTUALIZAR LOS DINEROS DE TODOS LOS JUGADORES EMIT
      var vendida = await asignaturasController.vender(clientes[socketId].partidaActiva, clientes[socketId].username, coordenadas);
      var msg = "";

      const partida = await partidaController.infoPartida(clientes[socketId].partidaActiva)
      w.logger('debug', "partida:" + JSON.stringify(partida));

      var s = clientes[socketId].partidaActiva; 
      io.to(s.toString()).emit('infoPartida', partida);
      var m = {
        cod: vendida,
        msg: g.generarMsg(vendida, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('bancarrota', async (data, ack) => {
    if (data.socketId != null && data.coordenadas != null) {
      w.logger.verbose('Me declaro en bancarrota y me voy');
      const socketId = data.socketId;
      var coordenadas = data.coordenadas;
      clientes[socketId].partidaActiva = 32;
      var bancarrota = await partidaController.bancarrota(clientes[socketId].partidaActiva, clientes[socketId].username)
      const partida = await partidaController.infoPartida(clientes[socketId].partidaActiva);
      w.logger.debug ("partida:" + JSON.stringify(partida));

      var s = clientes[socketId].partidaActiva;
      io.to(s.toString()).emit('infoPartida', partida);
      if(partida.nombreJugadores.length <= 1){
        io.to(s.toString()).emit('finPartida', partida.nombreJugadores[0]);
      }
      var msg = "";
      var m = {
        cod: bancarrota,
        msg: g.generarMsg(bancarrota, "bancarrota")
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('aumentarCreditos', async(data, ack) => {
    if (data.socketId != null && data.coordenadas != null) {
      w.logger.verbose('Aumetar creditos de asignaturas');
      const socketId = data.socketId;
      var coordenadas = data.coordenadas;
      // clientes[socketId].partidaActiva = 36;

      var aumentada = await asignaturasController.aumentarCreditos(clientes[socketId].partidaActiva, clientes[socketId].username, coordenadas);
      var msg = "";
      var m = {
        cod: aumentada,
        msg: g.generarMsg(aumentada, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('infoPartida', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Devolver info partida');
      const socketId = data.socketId;
      clientes[socketId].partidaActiva = 32;
      var partida = await partidaController.infoPartida(clientes[socketId].partidaActiva);
      var msg;
      if (partida != 1 && partida != 2) {
        w.logger.verbose('Partida obtenida:' + partida.toString());
        msg = partida;
        partida = 0;
      }
      var m = {
        cod: partida,
        msg: g.generarMsg(partida, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  // ==============================================
  // FUNCIONES DE CARTAS
  // ==============================================
  socket.on('suerte', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Tarjeta aleatoria de suerte');
      const socketId = data.socketId;
      var partida = await partidaController.findPartida(clientes[socketId].partidaActiva);
      var tarjeta = await cartasController.tarjetaAleatoria('suerte', clientes[socketId].username, partida);
      
      var msg = "";
      if (tarjeta != 2) {
        msg = tarjeta;
        tarjeta = 0;

        const partida = await partidaController.infoPartida(clientes[socketId].partidaActiva)
        w.logger.debug ("partida:" + JSON.stringify(partida));

        var s = clientes[socketId].partidaActiva;
        io.to(s.toString()).emit('infoPartida', partida);
      }
      var m = {
        cod: tarjeta,
        msg: g.generarMsg(tarjeta, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('boletin', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Tarjeta aleatoria de suerte');
      const socketId = data.socketId;
      // clientes[socketId].partidaActiva = 1;
      var partida = await partidaController.findPartida(clientes[socketId].partidaActiva);
      var tarjeta = await cartasController.tarjetaAleatoria('boletin', clientes[socketId].username, partida );
      var msg = "";
      if (tarjeta != 2) {
        msg = tarjeta;
        w.logger.verbose(msg);
        tarjeta = 0;

        const partida = await partidaController.infoPartida(clientes[socketId].partidaActiva)
        w.logger.debug ("partida:" + JSON.stringify(partida));

        var s = clientes[socketId].partidaActiva;
        io.to(s.toString()).emit('infoPartida', partida);
      }
      var m = {
        cod: tarjeta,
        msg: g.generarMsg(tarjeta, msg)
      }
      w.logger.verbose(m);
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  // ==============================================
  // FUNCIONES DE TIENDA
  // ==============================================
  socket.on('tienda', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('Tienda');
      const socketId = data.socketId;
      var tienda = await tiendaController.devolverTienda(clientes[socketId].username);
      var msg = "";
      if (tienda != 1 && tienda != 2) {
        w.logger.verbose('Se ha realizado la obtencion de los productose');

        msg = tienda;
        w.logger.debug('tienda: ' + tienda);

        tienda = 0;
      }
      var m = {
        cod: tienda,
        msg: g.generarMsg(tienda, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('comprarTienda', async (data, ack) => {
    if (data.socketId != null && data.producto != null) {
      w.logger.verbose('Tienda');
      const socketId = data.socketId;
      const producto = data.producto;
      var comprado = await tiendaController.comprarTienda(producto, clientes[socketId].username);
      var msg = "";
      if (comprado != 1 && comprado != 2) {
        w.logger.verbose('Se ha comprado el producto correctamente');

        msg = comprado;
        w.logger.debug('comprado: ' + comprado);

        comprado = 0;
      }
      var m = {
        cod: comprado,
        msg: g.generarMsg(comprado, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });

  socket.on('pagarJulio', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('voyAJulio');
      const socketId = data.socketId;

      var pagar = await partidaController.pagarJulio(clientes[socketId].username, clientes[socketId].partidaActiva);
      var msg = "";
      var m = {
        cod: pagar,
        msg: g.generarMsg(pagar, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });


  socket.on('estaJulio', async (data, ack) => {
    if (data.socketId != null) {
      w.logger.verbose('estaJulio');
      const socketId = data.socketId;
      var msg;
      var esta = await partidaController.estaJulio(clientes[socketId].username, clientes[socketId].partidaActiva);
      msg = esta;
      esta = 0;
      var m = {
        cod: esta,
        msg: g.generarMsg(esta, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });


  socket.on('empezarPuja', async (data, ack) => {
    if (data.socketId != null && data.coordenadas != null) {
      w.logger.verbose('empezarPuja');
      const socketId = data.socketId;
      const coordenadas = data.coordenadas;
      w.logger('debug', coordenadas);
      var iniciar = await partidaController.subasta(clientes[socketId].username, clientes[socketId].partidaActiva, 0, coordenadas);
    
      if(iniciar != 2 && iniciar != 1){
        var asignatura = await asignaturasController.infoAsignatura(coordenadas);
        if(asignatura != 1){
          var s = clientes[socketId].partidaActiva;
          io.to(s.toString()).emit('hayPuja', asignatura);
        }
      }
      var msg = ""
      var m = {
        cod: iniciar,
        msg: g.generarMsg(iniciar, msg)
      }
      ack(m);

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }    
  });

  let timer;
  socket.on('pujar', async (data, ack) => {
    if (data.socketId != null && data.cantidad != null) {
      w.logger.verbose('pujar');
      const socketId = data.socketId;
      const cantidad = data.cantidad;

      clearTimeout(timer);

      var subasta = await partidaController.subasta(clientes[socketId].username, clientes[socketId].partidaActiva, cantidad, '')

      var partida = await partidaController.findPartida(clientes[socketId].partidaActiva);

      var pujado = {
        nombre: clientes[socketId].username,
        precio: partida.subasta.precio
      }
      w.logger('verbose', pujado);
      if(subasta != 2 && subasta != 1){

        if(asignatura != 1){
          var s = clientes[socketId].partidaActiva;
          io.to(s.toString()).emit('actualizarPuja', pujado);

          //TODO: - HECHO COMPRARLAAAAAA!!!!
        }
      }

      timer = setTimeout(() => {
        // La función que se ejecutará después de un tiempo determinado
        // ...
        //comprar asignatura
        // sacar la info de la partida y mandarla en terminarPuja
        var s = clientes[socketId].partidaActiva;
        io.to(s.toString()).emit('terminarPuja', 'ok');

      }, 15000); // Tiempo de espera en milisegundos

    } else {
      w.logger.info("ALGUN DATO ES UNDEFINED");
    }
  });


  // Escucha el evento 'disconnect'
  socket.on('disconnect', () => {
    // w.logger.verbose('Usuario desconectado');
    // w.logger.verbose('Se ha desconectado el usuario: ' + clientes[socket.id].socket + ' ' + clientes[socket.id].username);

    // Elimina la conexión del objeto connections
    // socket.leave(clientes[socket.id].partidaActiva);
    delete clientes[socket.id];
    num--;
    // w.logger.verbose('Numero de usuarios conectados ' + num);

  });

  


});


//puja10, puja50, puja100
//actualizarPuja socket.on en front

//TODO: HECHO - CAMBIAR QUE BANCARROTA NO TE ELIMINE
server.listen(80, () => {   w.logger.info('Servidor escuchando en el puerto 80'); });

// server.listen(3000, () => { w.logger.info('Servidor escuchando en el puerto 3000'); });