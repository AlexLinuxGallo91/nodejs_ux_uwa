const validaciones = require('./validaciones');

/**
 *
 * @param correo
 * @param cuerpoPrincipalJson
 */
const establecerEstructuraPrincipalJson = (correo, cuerpoPrincipalJson) => {
    let jsonBase = {};
    jsonBase.node = correo;
    jsonBase.body = cuerpoPrincipalJson;

    return jsonBase;
}

/**
 *
 */
const establecerRaizJson = () => {
    let jsonBase = {};

    jsonBase.start = "";
    jsonBase.end = "";
    jsonBase.status = "";
    jsonBase.time = 0;
    jsonBase.steps = [];

    return jsonBase;
}

/**
 *
 * @param order
 * @returns {{}|*}
 */
const generarNodoPadre = (order) => {
    nodoPadre = {};

    nodoPadre.order = order;
    nodoPadre.name = '';
    nodoPadre.status = '';
    nodoPadre.output = [];
    nodoPadre.start = '';
    nodoPadre.end = '';
    nodoPadre.time = 0;

    return nodoPadre
}

/**
 *
 * @param order
 * @returns {{}|*}
 */
const generarNodoHijo = (order) => {
    nodoHijo = {};

    nodoHijo.order = order;
    nodoHijo.name = '';
    nodoHijo.status = '';
    nodoHijo.output = '';

    return nodoHijo;
}

/**
 *
 */
const generarNuevoTemplateJson = () => {
    jsonEnviar = establecerRaizJson();

    jsonEnviar.steps.push(generarNodoPadre(1));
    jsonEnviar.steps.push(generarNodoPadre(2));
    jsonEnviar.steps.push(generarNodoPadre(3));

    jsonEnviar.steps[0].output = [generarNodoHijo(1)];
    jsonEnviar.steps[1].output = [generarNodoHijo(1)];
    jsonEnviar.steps[2].output = [generarNodoHijo(1)];

    jsonEnviar.steps[0].name = "Inicio de Sesi\u00f3n en OWA";
    jsonEnviar.steps[1].name = "Navegaci\u00f3n entre carpetas";
    jsonEnviar.steps[2].name = "Validaci\u00f3n de Cierre de Sesi\u00f3n en OWA";

    jsonEnviar.steps[0].output[0].name = "Inicio de sesi\u00f3n dentro del portal OWA";
    jsonEnviar.steps[1].output[0].name = "Navegaci\u00f3n entre carpetas del correo electr\u00f3nico";
    jsonEnviar.steps[2].output[0].name = "Cierre de sesi\u00f3n dentro del portal OWA";

    return jsonEnviar;
}

/**
 *
 * @param json
 * @param numStep
 * @param numStepOut
 * @param status
 * @param outStatus
 * @param msgOutput
 * @param start
 * @param end
 * @param time
 * @returns {*}
 */
const generarJsonStepError = (json, numStep, numStepOut, status,
    outStatus, msgOutput, fechaInicial, fechaFinal) => {

    json.steps[numStep].status = status;
    json.steps[numStep].start = validaciones.obtenerFechaFormateada(fechaInicial);
    json.steps[numStep].end = validaciones.obtenerFechaFormateada(fechaFinal);
    json.steps[numStep].time = validaciones.obtenerDiferenciaTiempoSegundos(fechaInicial, fechaFinal);
    json.steps[numStep].output[numStepOut].status = outStatus;
    json.steps[numStep].output[numStepOut].output = msgOutput;

    return json;
}

module.exports = {
    establecerEstructuraPrincipalJson: establecerEstructuraPrincipalJson,
    establecerRaizJson: establecerRaizJson,
    generarNodoPadre: generarNodoPadre,
    generarNodoHijo: generarNodoHijo,
    generarNuevoTemplateJson: generarNuevoTemplateJson,
    generarJsonStepError : generarJsonStepError
}