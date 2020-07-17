const proc = require('process');
const jsonResult = require('./jsonResult.js');
const puppeteer = require('puppeteer');
const validaciones = require('./validaciones');
const constantes = require('./constantes');
const steps = require('./steps');
const logger = require('./logger/logger');

(async () => {

    let jsonCorreoPrueba = jsonResult.generarNuevoTemplateJson();
    let jsonRaiz = jsonResult.establecerEstructuraPrincipalJson();
    let jsonParam = {};
    let args = proc.argv;
    let fechaInicio = new Date();

    jsonParam = await validaciones.verificacionArgsJson(args).then((json) => {
        logger.info(`Iniciando prueba con la cuenta ${json.user}`);
        return json;
    }).catch((e) => {
        console.error(e.message);
        logger.info(`${e.message}`);
        process.exit(1);
    });

    logger.info(`Inicializando navegador para la prueba Exchange`);
    const browser = await puppeteer.launch({
        args: [
            constantes.BROWSER_LAUNCH_NO_SANDBOX,
            constantes.BROWSER_WINDOW_SIZE],
        headless: true
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 720, deviceScaleFactor: 1});

    jsonCorreoPrueba = await steps.stepIngresoPortalOwa(page, jsonCorreoPrueba, jsonParam)
        .then((json) => {
            logger.info(`Se finaliza correctamente el step de ingreso al portal OWA`);
            return json;
        })
        .catch((errorUxOwa) => {
            logger.info(`Sucedio un error durante el step de ingreso al portal OWA: ${errorUxOwa.message}`);
            return jsonResult.generarJsonStepError(jsonCorreoPrueba, 0, 0,
                constantes.FAILED, constantes.FAILED, errorUxOwa.message, errorUxOwa.dateStart, errorUxOwa.dateEnd);
        });

    if (await validaciones.existeElementoHtml(page, '#signInErrorDiv')) {
        let msgError = await validaciones.obtenerMensajeErrorCredenciales(page);
        msgError = msgError.trim();
        logger.error(`Se presenta acceso invalido al portal por credenciales erroneas: ${msgError}`);
        jsonRaiz = validaciones.generarJsonErrorCredenciales(jsonParam, jsonRaiz, jsonCorreoPrueba, msgError,
            fechaInicio);
        console.log(JSON.stringify(jsonRaiz));
        logger.info(`Se finaliza la prueba, JSON de finalizacion: ${JSON.stringify(jsonRaiz)}`);

        //cierra el navegador
        await browser.close();

        process.exit(1);
    }

    jsonCorreoPrueba = await steps.stepNavegacionBuzonDeEntrada(page, 120, 10, jsonCorreoPrueba)
        .then((json) => {
            logger.info(`Se finaliza correctamente el step de navegacion dentro del buzon de entrada`);
            return json;
        })
        .catch((errorUxOwa) => {
            logger.error(`Sucedio un error dentro del step de navegacion dentro del buzon de entrada: ${errorUxOwa.message}`);
            return jsonResult.generarJsonStepError(jsonCorreoPrueba, 1, 0,
                constantes.FAILED, constantes.FAILED, errorUxOwa.message, errorUxOwa.dateStart, errorUxOwa.dateEnd);
        });

    jsonCorreoPrueba = await steps.stepCierreSesion(page, jsonCorreoPrueba, browser)
        .then((json) => {
            logger.info(`Se finaliza correctamente el step de cierre de sesion dentro del portal OWA`);
            return json;
        })
        .catch((errorUxOwa) => {
            logger.error(`Sucedio un error dentro del step de cierre de sesion dentro del portal OWA: ${errorUxOwa.message}`);
            return jsonResult.generarJsonStepError(jsonCorreoPrueba, 2, 0,
                constantes.FAILED, constantes.FAILED, errorUxOwa.message, errorUxOwa.dateStart, errorUxOwa.dateEnd);
        });

    //cerrando navegador
    logger.info(`cerrando navegador`);
    await browser.close();

    jsonRaiz.body = jsonResult.establecerTiempoFinalTotalPruebaUx(jsonCorreoPrueba, fechaInicio);
    jsonRaiz.node = jsonParam.user;

    console.log(JSON.stringify(jsonRaiz));
    logger.info(`JSON Resultado Final: ${JSON.stringify(jsonRaiz)}`);
})();




