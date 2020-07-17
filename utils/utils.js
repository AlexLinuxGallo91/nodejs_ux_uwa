const fs = require('fs');
const logger = require('../logger/logger');
const constantesLogger = require('../logger/constantesLogger');
const walk = require('walk');
const path = require('path');

const obtenerListaArchivos = async (pathDir) => {
    return new Promise((res, rej) => {
        fs.readdir(pathDir, (err, archivos) => {
            if (err) {
                let errMsg = `No fue posible encontrar los archivos: ${err.message}`;
                logger.error(errMsg);
                rej(errMsg);
            }
            res(archivos);
        })
    })
};

const obtenerTamanioTotalDir = async (rutaFolder) => {

    let walker = walk.walk(rutaFolder, options);
    let folderSize = 0;

    walker.on("file", function (root, fileStats, next) {
        fs.readFile(fileStats.name, function () {
            folderSize += fileStats.size / 1048576;
            next();
        });
    });

    walker.on("end", function () {
        console.log("all done");
    });
};

const ordenarArrayFicherosAsc = (arreglo) => {
    const compare = (fileA, fileB) => {
        let dateFileA = undefined;
        let dateFileB = undefined;

        try {
            dateFileA = fs.statSync(`${constantesLogger.DIR_PATH_LOGS}${fileA}`).mtime;
            dateFileB = fs.statSync(`${constantesLogger.DIR_PATH_LOGS}${fileB}`).mtime;
        } catch (e) {
            dateFileA = dateFileB = new Date();
        }

        if (dateFileA < dateFileB) {
            return -1;
        }
        if (dateFileA > dateFileB) {
            return 1;
        }
        return 0;
    };

    return arreglo.sort(compare);
};

const eliminacionLogs = async (arregloArchivos) => {
    let contadorErrores = 0;
    let archivosEliminados = 0;
    let ultimoMensajeError = '';

    // verifica el tamanio de la carpeta
    console.log(`Tamanio del folder: ${await obtenerTamanioTotalDir(constantesLogger.DIR_PATH_LOGS)}`)
    console.log(`${constantesLogger.DIR_PATH_LOGS}`);

    //itera cada fichero y compara la diferencia de su respectiva fecha de modifacion en comparacion de la fecha actual
    //si supera los 30 dias. Si supera el tiempo el fichero es eliminado
    arregloArchivos.forEach((el, index, array) => {
        let dirArchivoPath = `${constantesLogger.DIR_PATH_LOGS}${el}`;

        if (el !== constantesLogger.NOMBRE_LOG) {
            try {
                let stats = fs.statSync(dirArchivoPath);
                let dateArchivo = stats.mtime;
                let diasDeDiferencia = (new Date() - dateArchivo) / (1000 * 60 * 60 * 24);
                if (diasDeDiferencia >= 30) {
                    console.log(`El archivo tiene una fecha de modificacion de mas de ${diasDeDiferencia} ` +
                        `dias.`);
                    fs.unlinkSync(dirArchivoPath);
                    archivosEliminados++;
                }
            } catch (e) {
                ultimoMensajeError = e.message;
                contadorErrores++;
            }
        }
    });

    //verifica si el directorio de los logs no sobrepasa el tamanio de 15MB


    if (contadorErrores > 0) {
        let msgError = `Se presenta en total de ${contadorErrores} intentos fallidos en la eliminacion de Logs.\n` +
            `Mientras tanto se presenta un total de ${archivosEliminados} archivos/logs eliminados exitosamente. Se ` +
            `muestra el ultimo mensaje de error obtenido durante la eliminacion de Logs: ${ultimoMensajeError}`;

        throw new Error(msgError);
    }

    return archivosEliminados;
};

module.exports = {
    obtenerListaArchivos: obtenerListaArchivos,
    eliminacionLogs: eliminacionLogs
};