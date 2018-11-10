const { UNSELECTED_POSITION, PLAYER_INDEX_1, PLAYER_INDEX_2 } = require('../../helpers/constants');

class Board {
    constructor(matchName, io) {
        this.matchName = matchName;
        this.io = io;
        this.gameBoardData = null;
        this.playerCount = 0;
        this.players = {
            [PLAYER_INDEX_1]: null,
            [PLAYER_INDEX_2]: null
        };
        this.currentTurn = null;
        this.resetGame();
    }

    getPlayerPlace() {
        const place = Object
            .keys(this.players)
            .find(place => this.players[place] === null);
        return !place ? null : +place;
    }

    hasAvailablePlace() {
        return this.getPlayerPlace() !== null;
    }

    getRamdonTurn() {
        const playerIds = Object.keys(this.players);
        return Math.ceil(Math.random() * playerIds.length);
    }

    getNextTurn() {
        return this.currentTurn == PLAYER_INDEX_1 ? PLAYER_INDEX_2 : PLAYER_INDEX_1;
    }

    resetGame() {
        this.gameBoardData = Array(9).fill(UNSELECTED_POSITION);
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
                    this.io.to(this.matchName).emit('waiting player', this.matchName);
                } else {
                    /*TODO:
                    this.io.to(this.matchName).emit('init', {
                        gameBoardData: this.gameBoardData,
                        unselectedPosition: UNSELECTED_POSITION,
                        number: playerPlace
                    });*/
                    this.currentTurn = this.getRamdonTurn();
                    Object.keys(this.players).forEach(playerPlace => {
                        playerPlace = +playerPlace;
                        this.players[playerPlace].emit('init', {
                            gameBoardData: this.gameBoardData,
                            unselectedPosition: UNSELECTED_POSITION,
                            playerPlace,
                            nickName: this.players[playerPlace].nickName,
                            currentTurn: this.currentTurn
                        });
                    })
                }
            });

            playerSocket.on('position marked', (currentGame) => {
                this.gameBoardData = currentGame;
                this.currentTurn = this.getNextTurn();
                console.log('position marked:gameBoardData', this.gameBoardData);
                console.log('position marked:currentTurn', this.currentTurn);
                //playerSocket.broadcast.emit('position marked', this.gameBoardData);
                /*playerSocket.to(this.matchName).emit('position marked', {
                    gameBoardData: this.gameBoardData,
                    currentTurn: this.currentTurn
                });*/
                this.io.to(this.matchName).emit('position marked', {
                    gameBoardData: this.gameBoardData,
                    currentTurn: this.currentTurn
                });
            });
        } else {
            playerSocket.emit('game full');
        }
    }
}

module.exports = Board;
