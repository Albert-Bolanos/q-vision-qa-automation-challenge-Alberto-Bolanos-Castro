import { PANEL_TOGGLE } from '../constants/index';

/**
 * /mi-cuenta/ sirve los paneles de acceso (#customer_login) y de registro (#customer_register) en el
 * mismo documento y alterna entre ellos con dos enlaces del propio sitio, que se limitan a agregar o
 * quitar la clase `hidden`. Decidir si hay que accionar el enlace exige leer esa clase, y esa lectura
 * tiene dos trampas que este helper evita de forma explícita:
 *
 *  1. La consulta debe REINTENTAR. Un `$body.find('<panel>.hidden')` resuelve al primer intento: si el
 *     panel todavía no está en el DOM devuelve 0 coincidencias, el toggle se omite en silencio y el
 *     fallo aparece después, como un "expected not to have class hidden" sin ningún click en el log.
 *     Por eso se espera primero a que el panel exista con `cy.get(...).should('exist')`.
 *
 *  2. La lectura no debe depender de la API de jQuery. El sujeto que entrega `cy.get` en este proyecto
 *     no expone `hasClass` (`$panel.hasClass is not a function`), así que se consulta el documento y se
 *     lee `classList`, que existe siempre en un elemento del DOM.
 *
 * El enlace que se acciona es el real del sitio; no se manipula la clase por DOM, porque eso simularía
 * el comportamiento de la página en lugar de ejercitarlo.
 */
class PanelToggle {
    show(panelSelector, toggleSelector, attempt = 1) {
        cy.get(panelSelector).should('exist');

        cy.document().then((doc) => {
            const panel = doc.querySelector(panelSelector);

            if (!panel.classList.contains('hidden')) {
                return;
            }

            expect(
                attempt,
                `El enlace ${toggleSelector} no logró mostrar ${panelSelector} tras ` +
                    `${PANEL_TOGGLE.MAX_ATTEMPTS} intentos. El sitio conecta ese toggle dentro de un ` +
                    `handler de DOMContentLoaded: si el JavaScript de la página falló antes de ` +
                    `conectarlo, el panel no se muestra nunca. Revisar en el log las excepciones no ` +
                    `capturadas de la página.`
            ).to.be.at.most(PANEL_TOGGLE.MAX_ATTEMPTS);

            cy.get(toggleSelector).should('be.visible').click();

            // Espera corta y deliberada entre reintentos: alternar el panel es una transición local
            // de CSS (quitar una clase), no una sincronización con estado asíncrono de backend.
            // Es la excepción permitida al uso de cy.wait, no un comodín de "esperar a que pase algo".
            cy.wait(PANEL_TOGGLE.RETRY_DELAY);

            this.show(panelSelector, toggleSelector, attempt + 1);
        });
    }
}

export default new PanelToggle();
