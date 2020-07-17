const BROWSER_LAUNCH_NO_SANDBOX = '--no-sandbox';
const BROWSER_WINDOW_SIZE = '--window-size=1920,1080';

const SUCCESS = 'SUCCESS';
const FAILED = 'FAILED';

//Step de ingreso al portal 
const STEP_INGRESO_PORTAL_OWA = `Se ingresa correctamente al portal con la cuenta %s`;

//Step de ingreso al portal
const STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_EXITOSO = 'Se cierra correctamente la sesion dentro del portal OWA';
const STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_FALLIDO = 'No fue posible cerrar la sesion dentro del portal OWA';

module.exports = {
    BROWSER_LAUNCH_NO_SANDBOX: BROWSER_LAUNCH_NO_SANDBOX,
    BROWSER_WINDOW_SIZE: BROWSER_WINDOW_SIZE,
    SUCCESS: SUCCESS,
    FAILED: FAILED,
    STEP_INGRESO_PORTAL_OWA: STEP_INGRESO_PORTAL_OWA,
    STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_EXITOSO: STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_EXITOSO,
    STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_FALLIDO: STEP_CIERRE_PORTAL_OWA_OUTPUT_CIERRE_FALLIDO
};