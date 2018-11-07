module.exports = function(client, io) {
    let board;
    let gamerCount = 0;
    let gamers = {
        1: null,
        2: null
    };
    const gamerPlace = getGamerPlace();
    if(gamerPlace) {
        gamerCount++;
        gamers[gamerPlace] = gamerCount;
        client.gamerPlace = gamerPlace;
        console.log(`Current connections ${gamerCount}`);
        console.log(`New gamer connected, gamerPlace ${gamerPlace}`);
        client.emit('init', {
            boardData: board,
            unselectedPosition: '  ',
            number: gamerPlace
        });

        client.on('position marked', function (currentGame) {
            board = currentGame;
            console.log('MOVE:game', board);
            client.broadcast.emit('position marked', board);
            //server.emit('move', board);
        });

        client.on('disconnect', function () {
            console.log('client.gamerPlace', client.gamerPlace)
            gamerCount--;
            gamers[client.gamerPlace] = null;
            resetGame();
            server.emit('position marked', board);
        });
    } else {
        client.emit('game full');
    }

    resetGame();
};


function getGamerPlace() {
    return Object.keys(gamers).find(place => gamers[place] === null);
}

function resetGame() {
    game = ['  ', '  ', '  ', '  ', '  ', '  ', '  ', '  ', '  '];
}