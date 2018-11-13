module.exports = {
    //Tamaño del tablero, este caso es de 3x3
    GAME_SIZE: 3,
    //Una posición sin marcar
    UNSELECTED_POSITION: '  ',
    //Identificador del jugador 1
    PLAYER_INDEX_1: 1,
    //Identificador del jugador 2
    PLAYER_INDEX_2: 2,
    //Caracteres de los jugadores:
    //CURSOR (indica la posicion actual de cada jugador en el tablero),
    //MARK (indica las posiciones marcadas por cada jugador en el tablero)
    GAMER_CHAR: {
        GAMER1_CURSOR: '⦿',
        GAMER1_MARK: 'O',
        GAMER2_CURSOR: '⦿',
        GAMER2_MARK: 'X',
    },
    //Posible estados de un juego
    GAME_STATE: {
        IN_PROGRESS: '1',
        FINISHED: '2',
        TIED: '3',
    },
    //Jugadas en las que un jugador puede ganar
    PLAYS_TO_WIN: [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ]
}