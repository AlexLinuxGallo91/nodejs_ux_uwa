/**
 *
 * @param page
 * @param idHtml
 * @param texto
 * @returns {Promise<void>}
 */
const insertartTextoElemHtml = async (page, idHtml, texto) => {
    try {
        await page.$eval(idHtml, (el, value) => el.value = value, texto);
    } catch (e) {
        throw new Error(`Sucedio un error al momento de insertar el texto dentro del elemento ${idHtml}` +
            `: ${e.message}`);
    }
};

/**
 *
 * @param page
 * @param url
 * @returns {Promise<void>}
 */
const navegarPagina = async (page, url) => {
    try {
        await page.goto(url);
    } catch (e) {
        throw new Error(`Sucedio un error al momento de navegar a la url ${url}: ${e.message}`);
    }
};

/**
 *
 * @param page
 * @param arrayElementosHtml
 * @returns {Promise<boolean>}
 */
const verificarElementosHtmlEnPagina = async (page, arrayElementosHtml) => {
    let result = true;

    for (let i = 0; i < arrayElementosHtml.length; i++) {
        let elemHtml = await page.$(arrayElementosHtml[i]);
        if (!elemHtml) {
            result = false;
        }
    }

    return result;
};

module.exports = {
    insertartTextoElemHtml: insertartTextoElemHtml,
    navegarPagina: navegarPagina,
    verificarElementosHtmlEnPagina: verificarElementosHtmlEnPagina
};