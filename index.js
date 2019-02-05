const dockerNames = require('docker-names');
const config = require('./config/config.json');
const Match = require('./src/modules/match');
const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ACTIVE_MATCHES = {};

app.use('/player', require('./src/modules/player'));

io.on('connection', function (client) {
    client.on('new match', function ({ nickName }) {
        const matchName = dockerNames.getRandomName().split('_').shift();
        const mMatch = new Match(matchName, io);
        client.nickName = nickName;
        client.matchName = matchName;
        mMatch.joinPlayer(client);
        ACTIVE_MATCHES[matchName] = mMatch;
    });

    client.on('join to match', function ({ nickName, matchName }) {
        client.nickName = nickName;
        client.matchName = matchName;
        ACTIVE_MATCHES[matchName].joinPlayer(client);
    });

    client.on('get available matches', () => {
        const matches = Object.keys(ACTIVE_MATCHES)
            .filter(matchName => ACTIVE_MATCHES[matchName].hasAvailablePlace() == true);
        client.emit('receive available matches', matches);
    });

    client.on('disconnect', () => {
        console.log('disconnect::playerSocket.playerPlace', client.playerPlace);
        if (client.matchName) {
            const match = ACTIVE_MATCHES[client.matchName];
            if (match) {
                match.playerCount--;
                match.players[client.playerPlace] = null;
                if (match.playerCount == 0) {
                    console.log('destroy match', client.matchName);
                    delete ACTIVE_MATCHES[client.matchName];
                } else {
                    match.resetGame();
                    io.to(client.matchName).emit('game reset', {
                        gameBoardData: match.gameBoardData,
                        currentTurn: match.currentTurn,
                    });
                    io.to(client.matchName).emit('waiting player', client.matchName);
                }
            }
        }
    });
});

const port = process.env.PORT || config.server.port;
server.listen(port, () => {
    console.log(`Server is listen on port ${config.server.port}`);
});