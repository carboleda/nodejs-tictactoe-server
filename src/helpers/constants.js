module.exports = {
    GAME_SIZE: 3,
    UNSELECTED_POSITION: '  ',
    PLAYER_INDEX_1: 1,
    PLAYER_INDEX_2: 2,
    GAMER_CHAR: {
        GAMER1_CURSOR: '⦿',
        GAMER1_MARK: 'O',
        GAMER2_CURSOR: '⦿',
        GAMER2_MARK: 'X',
    },
    GAME_STATE: {
        IN_PROGRESS: '1',
        FINISHED: '2',
        TIED: '3',
    },
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