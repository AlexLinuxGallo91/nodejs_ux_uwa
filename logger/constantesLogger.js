const utilsLogger = require('./utilsLogger');
const path = require('path');

const CUENTA_DE_CORREO = utilsLogger.obtenerCuentaCorreoPorProbar();

const CUENTA_DE_CORREO_SIN_DOMINIO = utilsLogger.obtenerNombreCuentaSinDominio(CUENTA_DE_CORREO);

const NOMBRE_LOG = utilsLogger.establecerNombreDelLog(CUENTA_DE_CORREO_SIN_DOMINIO);

const DIR_PATH_LOGS = `${__dirname}${path.sep}..${path.sep}Logs${path.sep}`;

module.exports = {
    CUENTA_DE_CORREO : CUENTA_DE_CORREO,
    CUENTA_DE_CORREO_SIN_DOMINIO : CUENTA_DE_CORREO_SIN_DOMINIO,
    NOMBRE_LOG : NOMBRE_LOG,
    DIR_PATH_LOGS : DIR_PATH_LOGS
};