const app = require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = 3000;
const usersArr = [];
const confArr = [];

server.listen(PORT, () => {
    //console.log(`Server started on localhost:${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/start.html');
});

io.sockets.on('connection', (socket) => {
    const user = {};
    user.id = Math.floor(Math.random() * 1000);
    //console.log(`user connected ID ${user.id}`);

    socket.on('userName', data => {
        const a = usersArr.some(item => {
            return item.name === data;
        });

        if (a) {
            socket.emit('changeName');
        } else {
            user.name = data;
            //console.log(`user ID ${user.id}. User name ${user.name}. Socket ID ${socket.id}`);
            usersArr.push(user);
            socket.emit('userNameConfirm', user);
        }
    });

    socket.on('createConf', data => {
        const a = confArr.some(item => { //проверка уникальности имени конференции
            return item === data;
        });

        if (a) {
            socket.emit('changeСonfName');
        } else {
            confArr.push(data);
            socket.join(data);
            socket.emit('createСonfConfirm', data);
            //console.log(`User ${user.name} create conference ${data}`);
        }
    });

    socket.on('joinConf', data => {
        const a = confArr.some(item => {
            return item === data;
        });

        if (a) {
            socket.join(data);
            socket.emit('joinConfConfirm', data);
            //console.log(`User ${user.name} join conference ${data}`);
        } else {
            socket.emit('confNotExist');
        }
    });

    socket.on('alertForConf', () => {
        let room = Object.keys(socket.rooms)[1];
        io.to(room).emit('message');
    });

    socket.on('newUser', data => {
        socket.to(ownerID(socket)).emit('newUserInConf', data);
    });

    socket.on('ownerStateToAll', data => {
        let room = Object.keys(socket.rooms)[1];
        socket.to(room).emit('synchData', data);
    });

    socket.on('alertForOwner', () => {
        socket.to(ownerID(socket)).emit('messageForOwner');
    });

    socket.on('disconnect', () => {
        io.sockets.emit('user disconnected ID', user.id);
        usersArr.splice(usersArr.indexOf(user),1);
        //console.log(`user ${user.name} disconnected ID ${user.id}`);

    });
});

function ownerID(socket) {
    let room = Object.keys(socket.rooms)[1];
    let roomsList = socket.adapter.rooms;
    let sockList = Object.keys(roomsList[room].sockets);
    return sockList[0];
}
