const config = require('./config/config.json');
const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ioServer = require('./src/io-server');

app.use('/player', require('./src/routes/player'));
ioServer.setEvents(io);

const port = process.env.PORT || config.server.port;
server.listen(port, () => {
    console.log(`Server is listen on port ${config.server.port}`);
});