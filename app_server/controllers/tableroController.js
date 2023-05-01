
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
    0: "0;0", // Beca
    // Parte de arriba
    1: "1;0",
    2: "2;0",
    3: "3;0",
    4: "4;0",
    5: "5;0",
    6: "6;0",
    7: "7;0",
    8: "8;0",
    9: "9;0",
    // Esquina superior derecha
    10: "10;0", // A Julio
    // Parte de la derecha
    11: "10;1",
    12: "10;2",
    13: "10;3",
    14: "10;4",
    15: "10;5",
    16: "10;6",
    17: "10;7",
    18: "10;8",
    19: "10;9",
    // Esquina inferior derecha
    20: "10;10", // Salida
    // Parde de abajo
    21: "9;10",
    22: "8;10",
    23: "7;10",
    24: "6;10",
    25: "5;10",
    26: "4;10",
    27: "3;10",
    28: "2;10",
    29: "1;10",
    // Esquina inferior izquierda
    30: "10;0", // Julio
    // Parte de la izquierda
    31: "0;9",
    32: "0;8",
    33: "0;7",
    34: "0;6",
    35: "0;5",
    36: "0;4",
    37: "0;3",
    38: "0;2",
    39: "0;1"
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
    // const cadena =  coordenadas.v.toString() + ';' + coordenadas.h.toString();
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
        // h: parseInt(partes[1]),
        // v: parseInt(partes[0])
    };
    var avance = {coordenadas: objeto, salida: salida};
    
    return avance; 
}

module.exports = {avanzar};
