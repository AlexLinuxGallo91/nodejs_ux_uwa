const utils = require('./utils/utils');
const constantesLogger = require('./logger/constantesLogger');
const logger = require('./logger/logger');
const path = require('path');
const fs = require('fs');

let dirPath = constantesLogger.DIR_PATH_LOGS;

(async () => {
    let archivos = await utils.obtenerListaArchivos(dirPath)
        .then((archivos) => {
            return archivos;
        })
        .catch((err) => {
            logger.error(err);
            return [];
        });

    await utils.eliminacionLogs(archivos)
        .then(contadorArchivosEliminados => {
            logger.info(`Se han eliminado un total de ${contadorArchivosEliminados} archivos/Logs`);
        })
        .catch(e => {
            logger.error(e);
        });
})();



