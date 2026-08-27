// Tiempos maximos de espera CONDICIONAL. Cypress reintenta la asercion hasta cumplirla o agotar
// el timeout: es polling acotado, no una espera fija. Nunca usar cy.wait(ms) para estos casos.
export const TIMEOUTS = {
    PAGE_LOAD: 30000,
    SELECT2_OPTIONS: 20000,
    // El cambio de texto del boton de envio depende de la validacion asincrona del formulario.
    ORDER_SUBMIT_READY: 30000,
    ORDER_GENERATION: 60000
};

// /mi-cuenta/ conecta los enlaces que alternan los paneles de acceso y registro dentro de un
// handler de DOMContentLoaded. Un unico click sin verificar es una carrera contra ese cableado,
// asi que se reintenta de forma acotada comprobando el efecto real en cada intento.
export const PANEL_TOGGLE = {
    MAX_ATTEMPTS: 3,
    RETRY_DELAY: 500
};

