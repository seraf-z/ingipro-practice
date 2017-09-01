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
            if (type !== 'viewer:change') {
                console.dir(`type -> ${data.type}; payload -> ${data.payload}`);
                console.log(data.payload);
            }

            switch (type) {
                case 'user:join':
                    user.name = data.payload.name;
                    conference.users.push(user);
                    let conferenceSync = {
                        type: 'conference:sync',
                        payload: {
                            userList: conference.users,
                            data: conference.state,
                        },
                    };
                    let conferenceJoin = {
                        type: 'conference:join',
                        payload: {
                            userId: user.userId,
                            name: user.name,
                            color: user.color,
                        },
                    };
                    let viewerModel = {
                        type: 'viewer:addModel',
                        payload: conference.state.model,
                    };
                    socket.emit('main', conferenceSync);
                    socket.emit('main', viewerModel);
                    socket.broadcast.emit('main', conferenceJoin);
                    break;

                case 'canvas:lock':
                    let a = conference.users.some(item => {
                        return item.owner === true;
                    });

                    if (a) {
                        let lockDenied = {
                            type: 'lock:denied',
                            payload: {
                                userId: user.userId,
                            }
                        };
                        socket.emit('main', lockDenied);
                    } else {
                        let lockAccept = {
                            type: 'lock:accept',
                            payload: {
                                userId: user.userId,
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

                case 'viewer:change':
                    conference.state.viewerChange = data.payload;
                    let viewerChange = {
                        type: 'viewer:change',
                        payload: conference.state.viewerChange
                    };
                    socket.broadcast.emit('main', viewerChange);
                    break;

                case 'viewer:addModel':
                    conference.state.model = data.payload;
                    socket.broadcast.emit('main', {
                        type: 'viewer:addModel',
                        payload: conference.state.model,
                    });
                    break;

                case 'chat:message':
                    socket.broadcast.emit('main', {
                        type: 'chat:message',
                        payload: {
                            userName: user.name,
                            message: data.payload.message,
                        },
                    });
                    break;
            }
        })

        .on('disconnect', () => {
            console.log(`user ${user.name} disconnect`);
            socket.broadcast.emit('main', {
                type: 'conference:leave',
                payload: {
                    userId: user.userId,
                    name: user.name,
                    color: user.color,
                },
            });
            let index = conference.users.indexOf(user);
            conference.users.splice(index, 1);
            if (conference.users === 0){
                conference.state = {};
            }
        });
});
