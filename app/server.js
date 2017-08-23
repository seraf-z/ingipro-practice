const express = require('express');
const randomColor = require('randomcolor');
const http = require('http');
const soketIO = require('socket.io');
const shortid = require('shortid');
const serveStatic = require('serve-static');

const app = express();
const server = http.createServer(app);
const io = soketIO(server);

const PORT = 3000;
const allConferences = {};

app.use('/', serveStatic(__dirname + 'build'));

server.listen(PORT, () => {
    console.log(`server listen ${PORT}`);
});

io.sockets.on('connection', (socket) => {
  // переподключение к конференции
  // console.log(socket.handshake.headers.cookie);
  let user = {};
  user.userID = shortid.generate();
  user.socketID = socket.id;
  user.color = randomColor();

  socket
    .on('main', data => {

      let type = data.type;

      switch (type) {
        case 'user:name':
          user.name = data.payload.name;
          socket.emit('userNameConfirm', user);
            break;

        case 'user:color':
          user.color = data.payload;
          break; // можно сделать менюшку на клиенте с выбором цвета

        case 'user:join': //должно содержать имя конференции
            const a = Object.keys(allConferences).some(item => { //проверка наличия конференции
                return item === data.payload.confName;
            });

            if ( a ) {
                user.confName = data.payload.confName;
                user.owner = false;
                socket.confName = data.payload.confName;
                allConferences[`${user.confName}`].users.push(user);
                socket.join(data.payload.confName);

                let conferenceJoin = {
                    type: 'conference:join',
                    payload: {
                        userID: user.userID,
                        name: user.name,
                        color: user.color
                    }
                };
                socket.to(socket.confName).emit('main', conferenceJoin);

                let conferenceSync = {
                    type: 'conference:sync',
                    payload: {
                        users: allConferences[`${user.confName}`].users,
                        data: allConferences[`${user.confName}`].state
                    }
                };
                socket.emit('main', conferenceSync);

                console.log(`User ${user.name} join to conference ${user.confName}`);
                socket.emit('joinConfConfirm');
            } else {
                let conferenceFail = {
                  type: 'conference:fail',
                  payload: {
                    message: 'ERROR'
                  }
                };
                socket.emit('main', conferenceFail);
            }
            break;

        case 'conference:create':
            const b = Object.keys(allConferences).some(item => { //проверка уникальности имени конференции
                return item === data.payload.confName;
            });

            if ( b ) {
                let conferenceFail = {
                    type: 'conference:fail',
                    payload: {
                        message: 'ERROR'
                    }
                };
                socket.emit('main', conferenceFail);
            } else {
                user.confName = data.payload.confName;
                user.owner = true;
                socket.confName = data.payload.confName;
                let conference = {};
                conference.state = {};
                conference.name = data.payload.confName;
                let users = [];
                users.push(user);
                conference.users = users;
                allConferences[`${conference.name}`] = conference;
                socket.join(data.payload.confName);
                socket.emit('createСonfConfirm',conference);
                console.log(`User ${user.name} create conference ${user.confName}`);
            }
            break;

        case 'canvas:lock':
          let arr = allConferences[`${user.confName}`].users;
          let c = arr.some(item => {
            return item.owner === true;
          });
          if ( c ) {
              let lockDenied = {
                  type: 'lock:denied',
                  payload: {
                      userID: user.userID
                  }
              };
              socket.emit('main', lockDenied);
          } else {
              let lockAccept = {
                  type: 'lock:accept',
                  payload: {
                      userID: user.userID
                  }
              };
              socket.emit('main', lockAccept);
          }
          break;

        case 'canvas:unlock':
          user.owner = false;
          break;

        case 'state:upload':
          if (user.owner === true) {
              allConferences[`${user.confName}`].state = data.payload.state;
              let stateChange = {
                type: 'state:change',
                payload: allConferences[`${user.confName}`].state
              };
              socket.to(socket.confName).emit('main', stateChange);
          }
          break;

        case 'alert':
            io.to(user.conf).emit(`message`);
            break; //для проверки
      }
    })

    .on('disconnect', () => {
        let conferenceLeave = {
            type: 'conference:leave',
            payload: {
                userID: user.userID,
            }
        };
        socket.to(user.confName).emit('main', conferenceLeave);
        console.log(`user ${user.name} disconnected`);
    })
});
