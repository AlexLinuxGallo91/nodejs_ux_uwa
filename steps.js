const accionesHtml = require('./accionesHtml');
const constantes = require('./constantes');
const util = require('util');
const validaciones = require('./validaciones');
const jsonResult = require('./jsonResult');
const error = require('./error');

const stepIngresoPortalOwa = async (page, json, jsonParam) => {
    let elemeHtmlPorVerificar = ['._n_a7'];
    let dateEjecucionInicial = new Date();

    try {
        await accionesHtml.navegarPagina(page, jsonParam.url);
        await page.waitFor(3000);

        await accionesHtml.insertartTextoElemHtml(page, '#username', jsonParam.user);
        await page.waitFor(2000);

        await accionesHtml.insertartTextoElemHtml(page, '#password', jsonParam.password);
        await page.waitFor(2000);

        await Promise.all([
            page.$eval('.signinbutton', btn => btn.click()),
            page.waitForNavigation({waitUntil: 'networkidle0'}),
        ]);

    } catch (e) {
        throw new error.ErrorUxOwa(`Sucedio un error durante el ingreso al portal: ${e.message}`, dateEjecucionInicial,
            new Date());
    }

    if (!await accionesHtml.verificarElementosHtmlEnPagina(page, elemeHtmlPorVerificar)) {
        throw new error.ErrorUxOwa(`Fue imposible ingresar al buzon de entrada del OWA, problema de rendereo en ` +
            `la pagina`, dateEjecucionInicial, new Date());
    }

    json = jsonResult.generarJsonStepError(json, 0, 0, constantes.SUCCESS,
        constantes.SUCCESS, util.format(constantes.STEP_INGRESO_PORTAL_OWA, jsonParam.user), dateEjecucionInicial,
        new Date());

    return json;
};

const stepNavegacionBuzonDeEntrada = async (page, tiempoEnSeg, segReload, json) => {

    let fechaInicio = new Date();
    let tiempoPorFinalizar = new Date();
    let contadoresErrores = 0;
    let iteracionRealizadas = 0;
    let ultimaCarpetaSeleccionada = '';
    let tiempoReinicio = segReload * 1000;
    let indexUltimaCarpetaSeleccionada = 0;
    let dateEjecucionInicial = new Date();

    tiempoPorFinalizar.setTime(fechaInicio.getTime() + (tiempoEnSeg * 1000));

    while (new Date() < tiempoPorFinalizar) {
        await page.waitFor(4000);
        let divContenedorCarpetas = [];

        if (await validaciones.existeElementoHtml(page, '._n_Z6')) {
            divContenedorCarpetas = await page.evaluate(() => Array.from(
                document.getElementsByClassName('_n_Z6'), element => element.textContent));
        } else {
            contadoresErrores++;
        }

        if (ultimaCarpetaSeleccionada === '' && divContenedorCarpetas.length !== 0) {
            ultimaCarpetaSeleccionada = divContenedorCarpetas[0];
            await page.evaluate(ultimaCarpetaSeleccionada => {
                let carpetaHtml = document.querySelector(`span._n_Z6[title='${ultimaCarpetaSeleccionada}']`);
                carpetaHtml.click();
            }, ultimaCarpetaSeleccionada);

        } else if (divContenedorCarpetas.length !== 0) {

            for (let i = 0; i < divContenedorCarpetas.length; i++) {
                if (ultimaCarpetaSeleccionada === divContenedorCarpetas[i]) {
                    indexUltimaCarpetaSeleccionada = i;
                    break;
                }
            }

            if (indexUltimaCarpetaSeleccionada === divContenedorCarpetas.length - 1) {
                indexUltimaCarpetaSeleccionada = 0;
            } else {
                indexUltimaCarpetaSeleccionada++;
            }

            ultimaCarpetaSeleccionada = divContenedorCarpetas[indexUltimaCarpetaSeleccionada];

            await page.evaluate((ultimaCarpetaSeleccionada) => {
                let carpetaHtml = document.querySelector(`span._n_Z6[title='${ultimaCarpetaSeleccionada}']`);
                carpetaHtml.click();
            }, ultimaCarpetaSeleccionada);
        }

        await page.waitFor(tiempoReinicio);
        await page.reload();
        iteracionRealizadas++;
    }

    if (contadoresErrores > (30 * iteracionRealizadas) / 100) {
        throw new error.ErrorUxOwa(`Se presenta un numero total de ${contadoresErrores} errores durante ` +
            `la navegacion del portal`, dateEjecucionInicial, new Date());
    }

    json = jsonResult.generarJsonStepError(json, 1, 0, constantes.SUCCESS, constantes.SUCCESS,
        'Se navega correctamente dentro del portal y buzon del portal OWA', dateEjecucionInicial,
        new Date());

    return json;
};

const stepCierreSesion = async (page, jsonCorreoPrueba) => {
    let dateEjecucionInicial = new Date();

    try {
        await page.waitFor(5000);
        await page.$eval('div._hl_d', btn => btn.click());
        await page.waitFor(5000);

        await page.evaluate(() => {
            let btn_cierre_sesion = document.evaluate('//span[text()="Sign out"]', document, null,
                XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

            if (btn_cierre_sesion == null) {
                btn_cierre_sesion = document.evaluate('//span[text()="Cerrar sesi\u00f3n"]', document,
                    null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            }

            btn_cierre_sesion.click();
        });

        await page.waitFor(5000);

    } catch (e) {
        throw new error.ErrorUxOwa(`Ocurrio un error durante el cierre de sesion: ${e.message}`, dateEjecucionInicial,
            new Date());
    }

    // verifica que esten el input de user y password
    if (await page.$('#username') !== null && await page.$('#password')) {
        jsonCorreoPrueba = jsonResult.generarJsonStepError(jsonCorreoPrueba, 2, 0,
            constantes.SUCCESS, constantes.SUCCESS, constantes.STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_EXITOSO,
            dateEjecucionInicial, new Date());
    } else {
        throw new error.ErrorUxOwa(constantes.STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_FALLIDO, dateEjecucionInicial,
            new Date());
    }

    return jsonCorreoPrueba;
};

module.exports = {
    stepIngresoPortalOwa: stepIngresoPortalOwa,
    stepNavegacionBuzonDeEntrada: stepNavegacionBuzonDeEntrada,
    stepCierreSesion: stepCierreSesion
};