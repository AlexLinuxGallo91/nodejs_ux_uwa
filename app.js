const proc = require('process');
const jsonResult = require('./jsonResult.js');
const puppeteer = require('puppeteer');
const validaciones = require('./validaciones');
const constantes = require('./constantes');
const steps = require('./steps');

(async () => {

    let jsonCorreoPrueba = jsonResult.generarNuevoTemplateJson();
    let jsonRaiz = jsonResult.establecerEstructuraPrincipalJson();
    let jsonParam = {};
    let args = proc.argv;
    let msgErrorCredenciales = undefined;
    let fechaInicio = new Date();

    jsonParam = await validaciones.verificacionArgsJson(args).then((json) => {
        return json;
    }).catch((e) => {
        console.error(e.message);
        process.exit(1);
    });

    const browser = await puppeteer.launch({
        args: [
            constantes.BROWSER_LAUNCH_NO_SANDBOX,
            constantes.BROWSER_WINDOW_SIZE],
        headless: false
    });

    const page = await browser.newPage();
    await page.setViewport({width: 1080, height: 720, deviceScaleFactor: 1});

    jsonCorreoPrueba = await steps.stepIngresoPortalOwa(page, jsonCorreoPrueba, jsonParam)
        .then((json) => {
            return json;
        })
        .catch((errorUxOwa) => {
            return jsonResult.generarJsonStepError(jsonCorreoPrueba, 0, 0,
                constantes.FAILED, constantes.FAILED, errorUxOwa.message, errorUxOwa.dateStart, errorUxOwa.dateEnd);
        });

    if (await validaciones.existeElementoHtml(page, '#signInErrorDiv')) {
        let msgError = await validaciones.obtenerMensajeErrorCredenciales(page);
        msgError = msgError.trim();
        jsonRaiz = validaciones.generarJsonErrorCredenciales(jsonParam, jsonRaiz, jsonCorreoPrueba, msgError);
        console.log(JSON.stringify(jsonRaiz));
        process.exit(1);
    }

    jsonCorreoPrueba = await steps.stepNavegacionBuzonDeEntrada(page, 120, 10, jsonCorreoPrueba)
        .then((json) => {
            return json;
        })
        .catch((errorUxOwa) => {
            return jsonResult.generarJsonStepError(jsonCorreoPrueba, 1, 0,
                constantes.FAILED, constantes.FAILED, errorUxOwa.message, errorUxOwa.dateStart, errorUxOwa.dateEnd);
        });

    jsonCorreoPrueba = await steps.stepCierreSesion(page, jsonCorreoPrueba, browser)
        .then((json) => {
            return json;
        })
        .catch((errorUxOwa) => {
            return jsonResult.generarJsonStepError(jsonCorreoPrueba, 2, 0,
                constantes.FAILED, constantes.FAILED, errorUxOwa.message, errorUxOwa.dateStart, errorUxOwa.dateEnd);
        });

    //cerrando navegador
    await browser.close();

    jsonRaiz.body = jsonCorreoPrueba;
    jsonRaiz.node = jsonParam.user;

    console.log(JSON.stringify(jsonRaiz));
    //console.log(validaciones.obtenerDiferenciaTiempoMs(fechaInicio));

})();




