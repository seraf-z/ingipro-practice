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
const conference = {
    users: [],
    state: {}
};

app.use('/', serveStatic(__dirname + '..' + 'build'));

server.listen(PORT, () => {
    console.log(`server listen ${PORT}`);
});

io.sockets.on('connection', (socket) => {
    let user = {};
    user.userID = shortid.generate();
    user.socketID = socket.id;
    user.color = randomColor();

    socket
        .on('main', data => {

            let type = data.type;

            switch (type) {
                case 'user:join':
                    user.name = data.payload.name;
                    conference.users.push(user);
                    let conferenceSync = {
                        type: 'conference:sync',
                        payload: {
                            userList: conference.users,
                            state: conference.state
                        }
                    };
                    let conferenceJoin = {
                        type: 'conference:join',
                        payload: {
                            userId: user.userID,
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
            }
        })

        .on('disconnect', () => {
            let conferenceLeave = {
                type: 'conference:leave',
                payload: {
                    userId: user.userID,
                    name: user.name,
                    color: user.color
                }
            };
            socket.broadcast.emit('main', conferenceLeave);
        })
});
