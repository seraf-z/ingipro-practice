const express = require('express');
const app = express();
//const randomColor = require('randomcolor');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3002;
const allStates = []; // все конференции сервера


server.listen(PORT, () => {
    console.log(`server listen ${PORT}`);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/startStateOnServ.html');
});

io.sockets.on('connection', (socket) => {

  socket.uuid = Math.floor(Math.random() * 1000);
  //socket.color = randomColor();

  socket
    .on('message', data => {

      let type = data.type;

      switch (type) {
        case 'user:name':
          socket.name = data.payload;
          console.log(`socket.uuid = ${socket.uuid}. socket.name = ${socket.name}`);
          socket.emit('userNameConfirm');
          break;

        case 'user:color':
          socket.color = data.payload;
          break; //можно сделать менюшку на клиенте с выбором цвета
                 //или назначать сервером через require('randomcolor')

        case 'user:join':
            const a = allStates.some(item => { //проверка наличия конференции
                return item === data.payload;
            });

            if ( a ) {
                socket.conf = data.payload;
                socket.win = false;
                socket.join(data.payload);
                socket.emit('joinConfConfirm');
                console.log(`User ${socket.name} join to conference ${socket.conf}`);

            } else {
                socket.emit('confNotExist')
            }
            break;

        case 'conference:name':
            const b = allStates.some(item => { //проверка уникальности имени конференции
                return item === data.payload;
            });

            if ( b ) {
                socket.emit('changeСonfName')
            } else {
                socket.conf = data.payload;
                socket.win = true;
                socket.join(data.payload);
                allStates.push(data.payload);
                console.log(allStates);
                socket.emit('createСonfConfirm');
                console.log(`User ${socket.name} create conference ${socket.conf}`);
            }
            break;

        case 'canvas:lock':
          /* ... */
          break;

        case 'canvas:unlock':
          /* ... */
          break;

        case 'alert':
            io.to(socket.conf).emit(`message`);
            break; //для проверки
      }
    })

    .on('disconnect', () => {
        console.log(`user disconnected. Socket ID ${socket.id}`);
    })
});
