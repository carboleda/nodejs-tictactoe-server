const {
    PLAYS_TO_WIN,
    GAME_STATE,
    UNSELECTED_POSITION,
    GAMER_CHAR
} = require('../../helpers/constants');
const Utilities = require('../../helpers/utilities');

/**
 * Realiza las vaidaciones sobre el tablero despues de cada juagada (posicion marcada)
 * @param {Array} currentGame tablero de juego
 * @param {Integer} playerPlace index del jugador
 * @returns {Object} un objeto con el resultado de las validaciones. El objeto contiene:
 * {
 *  state: {@link helpers/constants.js#GAME_STATE},
 *  winnerPlace: null o place del jugador que gano la partida,
 *  winningPlay: array con las posiciones que marco el jugador para ganar la partida
 * }
 */
function positionMarked(currentGame, playerPlace) {
    return new Promise((resolve, reject) => {
        const result = {
            state: GAME_STATE.IN_PROGRESS,
            winnerPlace: null,
            winningPlay: []
        };

        //Se obtiene el caracter de marcado del jugador
        const playerMark = Utilities.getPlayerMarker(GAMER_CHAR, playerPlace);
        //Se verifica si el jugador gano la partida con esta jugada
        const winningPlay = isWinnerPlayer(currentGame, playerMark);
        //Si winningPlay es un array (significa que viene la juagada ganadora)
        if (Array.isArray(winningPlay)) {
            //Se determina el estado del juego como finalizado...
            result.state = GAME_STATE.FINISHED;
            result.winnerPlace = playerPlace;
            result.winningPlay = winningPlay;
        } else {
            //De lo contrario se verifica si aun hay posiciones hay disponibles en la partida
            const availablePositions = getAvailablePositions(currentGame);
            //Si ya no hay posiciones disponibles se deterina el estado del juego como empatado
            if(!availablePositions || availablePositions.length == 0) {
                result.state = GAME_STATE.TIED;
            }
        }

        resolve(result);
    });
}

/**
 * Verifica si el jugador gano la partida de acuerdo al estado actual del tablero
 * @param {Array} currentGame tablero de juego
 * @param {*} playerMark caracter de marcado del jugador
 * @returns {Array|Boolean} un array con la jugada si el jugador ganó o false en caso contrario
 */
function isWinnerPlayer(currentGame, playerMark) {
    //Recorre cada una de las posibles juagada con las que se puede ganar una partida
    for (let i = 0; i < PLAYS_TO_WIN.length; i++) {
        const playerWins = currentGame
            //Se filra del tablero de juego solo las posiciones correspondientes a la juagada
            .filter((position, index) => PLAYS_TO_WIN[i].indexOf(index) !== -1)
            //Se verifica si cada una de las posiciones tiene la marca del jugador
            .every(position => position === playerMark);

        //Si el resultado es true, siginifica que el jugador gano la partida,
        //entonces se retorna la jugada con la que gano
        if(playerWins) {
            return PLAYS_TO_WIN[i];
        }
    }

    //De lo contrario se retorna false
    return false;
}

/**
 * Devuelve las posiciones que aun estan sin marcar
 * @param {*} currentGame tablero de juego
 */
function getAvailablePositions(currentGame) {
    return currentGame.filter(position => position === UNSELECTED_POSITION);
}

module.exports = {
    positionMarked
};