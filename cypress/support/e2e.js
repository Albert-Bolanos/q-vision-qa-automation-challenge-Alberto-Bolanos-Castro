import './commands/index';
import 'allure-cypress';

// El sitio es WordPress con plugins de terceros: un error no capturado de analítica o de un script
// externo no debe tumbar un escenario funcional. Pero descartarlo en silencio esconde el caso en que
// un control del sitio no responde porque su propio JavaScript falló antes de conectarse, así que se
// deja registrado en el log de la corrida.
Cypress.on('uncaught:exception', (err) => {
    Cypress.log({
        name: 'excepción de la página',
        message: err.message,
        consoleProps: () => ({ error: err })
    });
    return false;
});
