const process = require('process');
const util = require('util');

const obtenerCuentaCorreoPorProbar = () => {
    let cuenta = '';
    let args = process.argv;
    let json = {};

    if (args.length > 2) {
        try {
            json = JSON.parse(args[2]);
        } catch (e) {
            json = {};
        }
    }

    if (json.hasOwnProperty('user')) {
        cuenta = json.user.trim();
    }

    return cuenta;
};

const obtenerNombreCuentaSinDominio = (cuentaExchange) => {
    return cuentaExchange.substring(0, cuentaExchange.lastIndexOf("@"));
};

const establecerNombreDelLog = (nombreCuenta) => {
    let fecha = new Date();
    let nombreLog = '%d_%s_%s_%s_%s_%s_%s_%d.log';
    let nombreCuentaSinDominio = (!nombreCuenta ? '' : nombreCuenta);

    let anio = fecha.getFullYear();
    let mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
    let dia = ('0' + fecha.getDate()).slice(-2);
    let hora = ('0' + fecha.getHours()).slice(-2);
    let minutos = ('0' + fecha.getMinutes()).slice(-2);
    let segundos = ('0' + fecha.getSeconds()).slice(-2);
    let numeroAleatorio = Math.floor(100000 + Math.random() * 900000);

    let nombreLogFormateado = util.format(nombreLog, anio, mes, dia, hora, minutos, segundos,
        nombreCuentaSinDominio, numeroAleatorio);

    return nombreLogFormateado;
};

module.exports = {
    obtenerCuentaCorreoPorProbar : obtenerCuentaCorreoPorProbar,
    obtenerNombreCuentaSinDominio : obtenerNombreCuentaSinDominio,
    establecerNombreDelLog : establecerNombreDelLog
};
