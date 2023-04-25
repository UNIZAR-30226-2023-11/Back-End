
const tablero = [
    //Primer curso
    {h: 10, v: 10}, {h: 9, v: 10}, {h: 8, v: 10}, {h: 7, v: 10}, {h: 6, v: 10}, {h: 5, v: 10}, {h: 4, v: 10}, {h: 3, v: 10}, {h: 2, v: 10}, {h: 1, v: 10},
    //Segundo curso
    {h: 0, v: 10}, {h: 0, v: 9}, {h: 0, v: 8}, {h: 0, v: 7}, {h: 0, v: 6}, {h: 0, v: 5}, {h: 0, v: 4}, {h: 0, v: 3}, {h: 0, v: 2}, {h: 0, v: 1},
    //Tercer curso
    {h: 0, v: 0}, {h: 1, v: 0}, {h: 2, v: 0}, {h: 3, v: 0}, {h: 4, v: 0}, {h: 5, v: 0}, {h: 6, v: 0}, {h: 7, v: 0}, {h: 8, v: 0}, {h: 9, v: 0},
    //Cuarto curso
    {h: 10, v: 0}, {h: 10, v: 1}, {h: 10, v: 2}, {h: 10, v: 3}, {h: 10, v: 4}, {h: 10, v: 5}, {h: 10, v: 6}, {h: 10, v: 7}, {h: 10, v: 8}, {h: 10, v: 9}];


//const salida = 0;

function avanzar(coordenadas, total){
    //indice de la posicion actual
    const index = tablero.findIndex(coord => coord.h === coordenadas.h && coord.v === coordenadas.v);

    //indice de la posicion nueva
    let indice = (index + total) % tablero.length;
    var salida = false;
    if (index >= tablero.length - 12 && indice < 12){
        salida = true;
    }

    var avance = { coordenadas: tablero[indice] , salida: salida};
    return avance;
}

module.exports = {avanzar};
