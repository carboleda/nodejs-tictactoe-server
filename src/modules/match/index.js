const {
    GAME_SIZE,
    GAME_STATE,
    UNSELECTED_POSITION,
    PLAYER_INDEX_1,
    PLAYER_INDEX_2
} = require('../../helpers/constants');
const tictactoe = require('./tictactoe');
const database = require('../database');

/**
 * Clase que implementa la logica de una partida de tictactoe
 */
class Match {
    /**
     * Constructor de la clase
     * @param {String} matchName nombre de la partida
     * @param {Object} io referencia del servidor socket.io
     */
    constructor(matchName, io) {
        this.matchName = matchName;
        this.io = io;
        //Tablero de juego de la partida
        this.gameBoardData = null;
        //Indicador del turno actual, contiene el playerPlace (index) del jugador
        this.currentTurn = null;
        //Contador de cuantas conexiones hay en la partida
        this.playerCount = 0;
        //Objeto que almacena los sockets de los jugaodres
        this.players = {
            [PLAYER_INDEX_1]: null,
            [PLAYER_INDEX_2]: null
        };
        this.resetGame();
    }

    /**
     * Funcion encargada de resetar o inicializar la partida
     */
    resetGame() {
        this.currentTurn = null;
        //Se crea un array de acuerdo al tamaño de tablero con todas las posiciones sin seleccionar
        this.gameBoardData = Array(GAME_SIZE * GAME_SIZE).fill(UNSELECTED_POSITION);
    }

    /**
     * Funcion encargada de obtener el place que le recorresponde a un jugador
     */
    getPlayerPlace() {
        //Genera un array con las llaves del objeto players y luego
        //busca la primera llave cuyo valor este null lo cual significa que el place esta libre
        const place = Object
            .keys(this.players)
            .find(place => this.players[place] === null);
        //Retorna el place obtenido y en caso de de estar definido lo convierte a numerico (+)
        return !place ? null : +place;
    }

    /**
     * Funcion encargada de verificar si aun hay lugares disponibles en la partida
     */
    hasAvailablePlace() {
        return this.getPlayerPlace() !== null;
    }

    /**
     * Funcion encargada de obtener un turno de forma aleatoria
     */
    getRandomTurn() {
        const playerIndexes = Object.keys(this.players);
        return Math.ceil(Math.random() * playerIndexes.length);
    }

    getNextTurn() {
        return this.currentTurn == PLAYER_INDEX_1 ? PLAYER_INDEX_2 : PLAYER_INDEX_1;
    }

    /**
     * Permite que un jugador se una a una partida
     * @param {WebSocket} playerSocket socket del nuevo jugador
     */
    joinPlayer(playerSocket) {
        //Obtiene el place para el jugador
        const playerPlace = this.getPlayerPlace();
        //Si aun hay lugares disponibles
        if(playerPlace) {
            this.playerCount++;
            this.players[playerPlace] = playerSocket;
            playerSocket.playerPlace = playerPlace;
            console.log(`Current connections on ${this.matchName}: ${this.playerCount}`);
            console.log(`Player playerPlace: ${playerPlace}`);

            //Se une el jugador a la partida, pasando un callback para
            //identificar cuando el jugador ya se haya unido
            playerSocket.join(this.matchName, () => onPlayerJoined(this));

            //Evento para cuando una posicion del tablero es marcada por un juagador
            playerSocket.on('position marked',
                currentGame => onPositionMarked(this, playerSocket, currentGame));
        } else {
            playerSocket.emit('game full');
        }
    }
}

/**
 * Funcion callback para cuando un jugador se unió correctamente a una partida
 * @param {Match} match instancia de la partida
 */
function onPlayerJoined(match) {
    //Si aun hay lugares disponibles
    if(match.hasAvailablePlace()) {
        //Se le indica al jugador que se unió que se esta esperando otro jugador
        match.io.to(match.matchName).emit('waiting player', match.matchName);
    } else {
        //Se obtiene el turno
        match.currentTurn = match.getRandomTurn();
        //Se envia la configuración del juego a cada uno de
        //los jugadores en la partida
        Object.keys(match.players).forEach(playerPlace => {
            playerPlace = +playerPlace;
            match.players[playerPlace].emit('init', {
                gameBoardData: match.gameBoardData,
                unselectedPosition: UNSELECTED_POSITION,
                gameSize: GAME_SIZE,
                playerPlace,
                nickName: match.players[playerPlace].nickName,
                currentTurn: match.currentTurn
            });
        })
    }
}

/**
 * Funcion que maneja el evento sobre cuando una posicion es macrada en el tablero
 * @param {Match} match instancia de la partida
 * @param {WebSocket} playerSocket socket del jugador
 * @param {Array} currentGame array con el estado del juego
 */
function onPositionMarked(match, playerSocket, currentGame) {
    match.gameBoardData = currentGame;

    //Se invoca la funcion que aplica la logica del juego cada vez que se marca una posicion
    tictactoe.positionMarked(match.gameBoardData, playerSocket.playerPlace)
    .then((result) => {
        //Se obtiene el siguiente turno
        match.currentTurn = match.getNextTurn();
        const gameState = {
            gameBoardData: match.gameBoardData,
            currentTurn: match.currentTurn
        };

        //Si despues de marcada una posicion el juego sigue estando en progreso
        switch(result.state) {
            case GAME_STATE.IN_PROGRESS:
                console.log('position marked:gameBoardData', match.gameBoardData);
                console.log('position marked:currentTurn', match.currentTurn);
                //Se notifica a los jugadores en la partida sobre la posición que fue marcada
                //y el nuevo estado del tablero
                match.io.to(match.matchName).emit('position marked', gameState);
            break;
            default:
                const opponentNickName = match.players[match.currentTurn].nickName;
                database.saveMatchResult({
                    ...result,
                    ...{ nickName: playerSocket.nickName, boardSize: GAME_SIZE, opponentNickName }
                });
                //De lo contrario es porque el juego quedo empatado o finalizado,
                //entonces se notifica a todos los jugadores en la partida
                //el nuevo estado de la partida
                match.io.to(match.matchName).emit('game state', { ...gameState, ...result });
                match.resetGame();
        }
    });
}

module.exports = Match;
