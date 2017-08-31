const express = require('express');
const randomColor = require('randomcolor');
const http = require('http');
const soketIO = require('socket.io');
const path = require('path');
const serveStatic = require('serve-static');

const app = express();
const server = http.createServer(app);
const io = soketIO(server);

const PORT = 3000;
const conference = {
    users: [],
    state: {},
};

//app.use(serveStatic(__dirname + '..' + 'build'));
app.use(serveStatic(path.join(__dirname, '..', 'build')));

server.listen(PORT, () => {
    console.log(`server listen ${PORT}`);
});

io.sockets.on('connection', (socket) => {
    let user = {
        userId: Math.random(),
        color: randomColor(),
    };

    socket
        .on('main', data => {

            let type = data.type;
            console.dir(`type -> ${data.type}; payload -> ${data.payload}`);
            console.log(data.payload);

            switch (type) {
                case 'user:join':
                    user.name = data.payload.name;
                    conference.users.push(user);
                    let conferenceSync = {
                        type: 'conference:sync',
                        payload: {
                            users: conference.users,
                            data: conference.state
                        }
                    };
                    let conferenceJoin = {
                        type: 'conference:join',
                        payload: {
                            userId: user.userId,
                            name: user.name,
                            color: user.color
                        }
                    };
                    socket.emit('main', conferenceSync);
                    socket.broadcast.emit('main', conferenceJoin);
                    break;

                case 'canvas:lock':
                    let a = conference.users.some(item => {
                        return item.owner === true;
                    });

                    if ( a ) {
                        let lockDenied = {
                            type: 'lock:denied',
                            payload: {
                                userId: user.userID
                            }
                        };
                        socket.emit('main', lockDenied);
                    } else {
                        let lockAccept = {
                            type: 'lock:accept',
                            payload: {
                                userId: user.userID
                            }
                        };
                        let conferenceLock = {
                            type: 'conference:lock',
                            payload: {
                                userId: user.userID,
                                name: user.name,
                                color: user.color
                            }
                        };
                        socket.emit('main', lockAccept);
                        socket.broadcast.emit('main', conferenceLock);
                    }
                    break;

                case 'canvas:unlock':
                    user.owner = false;
                    break;

                case 'state:upload':
                    if (user.owner === true) {
                        conference.state = data.payload.state;
                        let stateChange = {
                            type: 'state:change',
                            payload: {
                                state: conference.state
                            }
                        };
                        socket.broadcast.emit('main', stateChange);
                    }
                    break;

                case 'chat:message':
                    let chatMessage = {
                        type: 'chat:message',
                        payload: {
                            userName: user.name,
                            message: data.payload.message
                        }
                    };
                    io.emit('main', chatMessage);
                    break;
            }
        })

        .on('disconnect', () => {
            console.log(`user ${user.name} disconnect`);
            let conferenceLeave = {
                type: 'conference:leave',
                payload: {
                    userId: user.userId,
                    name: user.name,
                    color: user.color,
                }
            };
            socket.broadcast.emit('main', conferenceLeave);
            let index = conference.users.indexOf(user);
            conference.users.splice(index, 1);
            console.log(conference.users);

        });
});
