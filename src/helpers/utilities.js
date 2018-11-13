/**
 * Función encargada de convertir un array a una matriz,
 * dividiendo el array en subarrays de tamaño cols
 * @param {Array} array array a convertir
 * @param {Integer} cols cantidad de columnas de la matriz
 */
function arrayToMatrix(array, cols) {
    const matrix = [];
    for(let i=0; i<=array.length-cols; i=i+cols) {
        matrix.push(array.slice(i, i + cols));
    }
    return matrix;
}

/**
 * Función encargada de convertir una matriz en un array,
 * concatenando cada fila de la matriz a un array
 * @param {Array} matrix array de arrays a convertir
 */
function matrixToArray(matrix) {
    return matrix.reduce((array, row) => {
        return [...array, ...row];
    }, []);
}

/**
 * Funcion encargada de quitar los caracteres unicode que representan el color
 * o el tipo de fuente asignados usando el paquete colors.
 * https://www.npmjs.com/package/colors
 * @param {String} str cadena de texto
 */
function stripColors(str) {
    return str.replace(/\x1B\[\d+m/g, '');
}

/**
 * Funcion encargada de generar un array con los caracteres de indicador de posicion (GAME_CHAR)
 * de cada jugador incluyendo las variantes de color.
 * NOTA: Una variante de color es el color que se configura para diferenciar cuando el cursor
 * esta sobre una posicion ya marcada
 * @param {Object} gameChars objeto con la definicion de los caracteres de los jugadores
 * @see {@link helpers/constants.js#GAMER_CHAR}
 */
function getPlayerCursors(gameChars) {
    const normal = Object.keys(gameChars)
        .filter(key => key.indexOf('_CURSOR') !== -1)
        .map(key => gameChars[key]);
    const colors = normal.map(item => item.bold.yellow);
    return [ ...normal, ...colors ];
}

/**
 * Funcion encargada de obtener el caracter de indicador de posicion de un jugador
 * @param {*} gameChars objeto con la definicion de los caracteres de los jugadores
 * @param {*} plyerPlace indice de la posicion de un jugador {@link helpers/constants.js#PLAYER_INDEX_1}
 * y {@link helpers/constants.js#PLAYER_INDEX_2}
 */
function getPlayerCursor(gameChars, plyerPlace) {
    return gameChars[`GAMER${plyerPlace}_CURSOR`];
}

/**
 * Funcion encargada de generar un array con los caracteres de posicion marcada (GAME_CHAR)
 * de cada jugador incluyendo las variantes de color.
 * NOTA: Una variante de color es el color que se configura para diferenciar cuando el cursor
 * esta sobre una posicion ya marcada
 * @param {Object} gameChars objeto con la definicion de los caracteres de los jugadores
 * @see {@link helpers/constants.js#GAMER_CHAR}
 */
function getPlayerMarkers(gameChars) {
    const normal = Object.keys(gameChars)
        .filter(key => key.indexOf('_MARK') !== -1)
        .map(key => gameChars[key]);
    const colors = normal.map(item => item.bold.yellow);
    return [ ...normal, ...colors ];
}

/**
 * Funcion encargada de obtener el caracter de posicion marcada de un jugador
 * @param {*} gameChars objeto con la definicion de los caracteres de los jugadores
 * @param {*} plyerPlace indice de la posicion de un jugador {@link helpers/constants.js#PLAYER_INDEX_1}
 * y {@link helpers/constants.js#PLAYER_INDEX_2}
 */
function getPlayerMarker(gameChars, plyerPlace) {
    return gameChars[`GAMER${plyerPlace}_MARK`];
}

module.exports = {
    arrayToMatrix,
    matrixToArray,
    stripColors,
    getPlayerCursors,
    getPlayerCursor,
    getPlayerMarkers,
    getPlayerMarker,
};