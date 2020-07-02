const constantes = require('./constantes');
const util = require('util');

/**
 *
 * @param args
 * @returns {Promise<void>}
 */
const verificacionArgsJson = async (args) => {
    let jsonParseado = {};
    let atributos = ['url', 'user', 'password'];

    if (args.length < 3) {
        throw new Error(`Favor de ingresar el json a probar`);
    }

    try {
        jsonParseado = JSON.parse(args[2]);
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw new Error('Parametro JSON no valido, se tiene error de sintaxis dentro del parametro del ' +
                'JSON, favor de verificar su sintaxis e intentar nuevamente la ejecucion de la prueba');
        } else {
            throw new Error('Sucedio un error al analizar el parametro del JSON');
        }
    }

    for (let atributo of atributos) {
        if (!jsonParseado.hasOwnProperty(atributo)) {
            throw new Error(`El JSON no contiene el atributo ${atributo}, favor de establecerlo` +
                ` e intentarlo nuevamente`);
        }
    }

    return jsonParseado;
};

/**
 *
 * @param page
 * @param idHtml
 * @returns {Promise<boolean>}
 */
const existeElementoHtml = async (page, idHtml) => {
    let elemHtml = await page.$(idHtml);
    return !!(elemHtml);
};

/**
 *
 * @param page
 * @returns {Promise<*>}
 */
const obtenerMensajeErrorCredenciales = async (page) => {
    let divMsgErrorCredenciales = await page.$('#signInErrorDiv');
    let msgError = await page.evaluate(divMsgErrorCredenciales =>
        divMsgErrorCredenciales.textContent, divMsgErrorCredenciales);

    if(msgError){ msgError = msgError.trim();}

    return msgError;
};

/**
 * Funcion el cual te permite obtener la diferencia de dos objetos Date (fecha inicial contra la fecha actual) en
 * milisegundos
 *
 * @param fechaInicial
 * @returns {number}
 */
const obtenerDiferenciaTiempoSegundos = (fechaInicial, fechaFinal) => {
    return (Math.abs(fechaFinal - fechaInicial) / 1000.0).toFixed(14);
};

/**
 *
 * @param fecha
 * @returns {string}
 */
const obtenerFechaFormateada = (fecha) =>{
    let anio = fecha.getFullYear();
    let mes = ('0'+(fecha.getMonth() + 1)).slice(-2);
    let dia = ('0' + fecha.getDate()).slice(-2);
    let hora = ('0' + fecha.getHours()).slice(-2);
    let minutos = ('0' + fecha.getMinutes()).slice(-2);
    let segundos = ('0' + fecha.getSeconds()).slice(-2);
    let cadenaFormat = '%d-%s-%sT%s:%s:%s-06:00';

    return util.format(cadenaFormat, anio, mes, dia, hora, minutos, segundos);
}


/**
 *
 * @param jsonParamCorreo
 * @param jsonRaiz
 * @param jsonCorreoPrueba
 * @param msgError
 * @returns {*}
 */
let generarJsonErrorCredenciales = (jsonParamCorreo, jsonRaiz, jsonCorreoPrueba, msgError) => {
    let msgError1 = `No fue posible ingresar al portal OWA, se presenta error de credenciales: ${msgError}`;
    let msgError2 = `No fue posible navegar dentro del portal OWA, se presenta error de credenciales: ${msgError}`;
    let msgError3 = `No fue posible cerrar la sesion dentro del portal OWA, se presenta error de credenciales: ${msgError}`;

    for (let i = 0; i < 3; i++) {
        jsonCorreoPrueba.steps[i].status = constantes.FAILED;
        jsonCorreoPrueba.steps[i].output[0].status = constantes.FAILED;

        switch (i) {
            case 0:
                jsonCorreoPrueba.steps[i].output[0].output = msgError1;
                break;
            case 1:
                jsonCorreoPrueba.steps[i].output[0].output = msgError2;
                break;
            case 2:
                jsonCorreoPrueba.steps[i].output[0].output = msgError3;
                break;
        }
    }

    jsonRaiz.body = jsonCorreoPrueba;
    jsonRaiz.node = jsonParamCorreo.user;

    return jsonRaiz;
};

module.exports = {
    verificacionArgsJson: verificacionArgsJson,
    existeElementoHtml: existeElementoHtml,
    obtenerMensajeErrorCredenciales: obtenerMensajeErrorCredenciales,
    generarJsonErrorCredenciales: generarJsonErrorCredenciales,
    obtenerDiferenciaTiempoSegundos : obtenerDiferenciaTiempoSegundos,
    obtenerFechaFormateada : obtenerFechaFormateada
};