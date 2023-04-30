
// const tablero = [
//     //Primer curso
//     {h: 10, v: 10}, {h: 9, v: 10}, {h: 8, v: 10}, {h: 7, v: 10}, {h: 6, v: 10}, {h: 5, v: 10}, {h: 4, v: 10}, {h: 3, v: 10}, {h: 2, v: 10}, {h: 1, v: 10},
//     //Segundo curso
//     {h: 0, v: 10}, {h: 0, v: 9}, {h: 0, v: 8}, {h: 0, v: 7}, {h: 0, v: 6}, {h: 0, v: 5}, {h: 0, v: 4}, {h: 0, v: 3}, {h: 0, v: 2}, {h: 0, v: 1},
//     //Tercer curso
//     {h: 0, v: 0}, {h: 1, v: 0}, {h: 2, v: 0}, {h: 3, v: 0}, {h: 4, v: 0}, {h: 5, v: 0}, {h: 6, v: 0}, {h: 7, v: 0}, {h: 8, v: 0}, {h: 9, v: 0},
//     //Cuarto curso
//     {h: 10, v: 0}, {h: 10, v: 1}, {h: 10, v: 2}, {h: 10, v: 3}, {h: 10, v: 4}, {h: 10, v: 5}, {h: 10, v: 6}, {h: 10, v: 7}, {h: 10, v: 8}, {h: 10, v: 9}];

const tablero = {
    // Esquina superior izquierda
    0: "0;0",
    // Parte de arriba
    1: "0;1",
    2: "0;2",
    3: "0;3",
    4: "0;4",
    5: "0;5",
    6: "0;6",
    7: "0;7",
    8: "0;8",
    9: "0;9",
    // Esquina superior derecha
    10: "0;10",
    // Parte de la derecha
    11: "1;10",
    12: "2;10",
    13: "3;10",
    14: "4;10",
    15: "5;10",
    16: "6;10",
    17: "7;10",
    18: "8;10",
    19: "9;10",
    // Esquina inferior derecha
    20: "10;10",
    // Parde de abajo
    21: "10;9",
    22: "10;8",
    23: "10;7",
    24: "10;6",
    25: "10;5",
    26: "10;4",
    27: "10;3",
    28: "10;2",
    29: "10;1",
    // Esquina inferior izquierda
    30: "10;0",
    // Parte de la izquierda
    31: "9;0",
    32: "8;0",
    33: "7;0",
    34: "6;0",
    35: "5;0",
    36: "4;0",
    37: "3;0",
    38: "2;0",
    39: "1;0"
}

//const salida = 0;

// function avanzar(coordenadas, total){
//     //indice de la posicion actual
//     const index = tablero.findIndex(coord => coord.h === coordenadas.h && coord.v === coordenadas.v);
//     //indice de la posicion nueva
//     let indice = (index + total) % tablero.length;
//     var salida = false;
//     if (index >= tablero.length - 12 && indice < 12){
//         salida = true;
//     }

//     var avance = { coordenadas: tablero[indice] , salida: salida};
//     return avance;
// }

function obtenerClave(valor) {
    const claveEncontrada = Object.keys(tablero).find(clave => tablero[clave] === valor);
    return claveEncontrada || null; // si no se encuentra el valor, devolvemos null
}

function avanzar(coordenadas, total){
    const cadena = coordenadas.h.toString() + ';' + coordenadas.v.toString();

    // indice de la posicion actual
    var index = obtenerClave(cadena);
    // indice de la posicion nueva
    var length = Object.keys(tablero).length;
    var indice = (parseInt(index) + total) % length;

    var salida = false;
    if (index<20 && indice >= 20) {
        salida = true;
    }
    const partes = tablero[indice].split(';');
    const objeto = {
        h: parseInt(partes[0]),
        v: parseInt(partes[1])
    };
    var avance = {coordenadas: objeto, salida: salida};
    
    return avance; 
}

module.exports = {avanzar};
