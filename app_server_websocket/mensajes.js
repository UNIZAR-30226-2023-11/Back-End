function generarMsg(codigo, msg) {
    switch (codigo) {
        case 0:
            return msg || 'Ok';
            break;
        case 1:
            return msg || "No se ha encontrado el valor o no se ha modificado nada";
            break;
        case 2:
            return "Error en la función"
            break;
        case 3:
            return "Ya hay un usuario con ese nombre"
            break;
        case 4:
            return "La partida está completa"
            break;
        case 5:
            return msg
            break;
        case 6:
            return "La casilla es tuya y puedes aumentar"
            break;
        case 7:
            return "La casilla es tuya y NO puedes aumentar"
            break;
        case 8:
            return "Puedes comprar la asignatura"
        default:
            return "";
    }
}

module.exports = {
    generarMsg
};