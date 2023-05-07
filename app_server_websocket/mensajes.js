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
        default:
            return "";
    }
}

module.exports = {
    generarMsg
};