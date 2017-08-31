const http = require('http');
const path = require('path');
const express = require('express');
const serveStatic = require('serve-static');

const PORT = 3000;
const app = express();
app.use(serveStatic(path.join(__dirname, '..', 'build')));

const server = http.Server(app);
server.listen(PORT, () => {
    // eslint-disable-next-line
    console.log(`Server started on localhost:${PORT}`);
});

const io = require('./socket')(server);
app.set('io', io);
// eslint-disable-next-line
console.log(`!!!`);
