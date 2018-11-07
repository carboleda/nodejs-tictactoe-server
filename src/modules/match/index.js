const { UNSELECTED_POSITION } = require('../../helpers/constants');

class Board {
    constructor(matchName, io) {
        this.matchName = matchName;
        this.io = io;
        this.gameBoard = null;
        this.playerCount = 0;
        this.players = {
            1: null,
            2: null
        };
        this.resetGame();
    }

    getPlayerPlace() {
        const place = Object
            .keys(this.players)
            .find(place => this.players[place] === null);
        return !place ? null : place;
    }

    hasAvailablePlace() {
        return this.getPlayerPlace() !== null;
    }

    resetGame() {
        this.gameBoard = Array(9).fill(UNSELECTED_POSITION);
    }

    joinPlayer(playerSocket) {
        const playerPlace = this.getPlayerPlace();
        if(playerPlace) {
            this.playerCount++;
            this.players[playerPlace] = playerSocket;
            playerSocket.playerPlace = playerPlace;
            console.log(`Current connections ${this.playerCount}`);
            console.log(`New player connected, playerPlace ${playerPlace}`);

            playerSocket.join(this.matchName, () => {
                if(this.hasAvailablePlace()) {
                    this.io.to(this.matchName).emit('waiting player');
                } else {
                    /*TODO:
                    this.io.to(this.matchName).emit('init', {
                        boardData: this.gameBoard,
                        unselectedPosition: UNSELECTED_POSITION,
                        number: playerPlace
                    });*/
                    Object.keys(this.players).forEach(playerPlace => {
                        this.players[playerPlace].emit('init', {
                            boardData: this.gameBoard,
                            unselectedPosition: UNSELECTED_POSITION,
                            number: playerPlace,
                            nickName: this.players[playerPlace].nickName
                        });
                    })
                }
            });

            playerSocket.on('position marked', (currentGame) => {
                this.gameBoard = currentGame;
                console.log('position marked:gameBoard', this.gameBoard);
                //playerSocket.broadcast.emit('position marked', this.gameBoard);
                playerSocket.to(this.matchName).emit('position marked', this.gameBoard);
            });
        } else {
            playerSocket.emit('game full');
        }
    }
}

module.exports = Board;
