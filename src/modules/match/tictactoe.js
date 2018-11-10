const {
    PLAYS_TO_WIN,
    GAME_STATE,
    UNSELECTED_POSITION,
    GAMER_CHAR
} = require('../../helpers/constants');
const Utilities = require('../../helpers/utilities');

function positionMarked(currentGame, playerPlace) {
    return new Promise((resolve, reject) => {
        const result = {
            state: GAME_STATE.IN_PROGRESS,
            winnerPlace: null,
            winningPlay: []
        }
        const playerMark = Utilities.getPlayerMarker(GAMER_CHAR, playerPlace);
        const winningPlay = isWinnerPlayer(currentGame, playerMark);
        const availablePositions = getAvailablePositions(currentGame);
        if (Array.isArray(winningPlay)) {
            result.state = GAME_STATE.FINISHED;
            result.winnerPlace = playerPlace;
            result.winningPlay = winningPlay;
        } else if(!availablePositions || availablePositions.length == 0) {
            result.state = GAME_STATE.TIED;
        }

        resolve(result);
    });
}

function isWinnerPlayer(currentGame, playerMark) {
    for (let i = 0; i < PLAYS_TO_WIN.length; i++) {
        const playerWins = currentGame
            .filter((position, index) => PLAYS_TO_WIN[i].indexOf(index) !== -1)
            .every(position => position === playerMark);
        if(playerWins) {
            return PLAYS_TO_WIN[i];
        }
    }

    return false;
}

function getAvailablePositions(currentGame) {
    return currentGame.filter(position => position === UNSELECTED_POSITION);
}

module.exports = {
    positionMarked
};