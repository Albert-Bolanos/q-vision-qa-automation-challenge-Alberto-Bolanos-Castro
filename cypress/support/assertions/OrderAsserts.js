import urlAsserts from './base/UrlAsserts';
import { MESSAGES, TIMEOUTS, UI_URLS } from '../constants/index';

class OrderAsserts {
    /**
     * La orden se considera generada cuando el sitio redirige a la página de pago. La espera es
     * condicional sobre la URL (Cypress reintenta hasta cumplirla o agotar el timeout), nunca una
     * espera fija: la generación de la orden es asíncrona (ver R-05 del test plan).
     */
    validateOrderGenerated() {
        urlAsserts.validateUrlContains(UI_URLS.ORDER_PAY, TIMEOUTS.ORDER_GENERATION);
    }

    /**
     * El número de pedido no tiene selector propio: se localiza por su etiqueta seguida de al menos
     * un dígito, mediante expresión regular. No se compara contra un literal fijo porque WooCommerce
     * lo genera dinámicamente.
     *
     * Se evita `.invoke('text')`: depende de que el sujeto exponga la API de jQuery, y en este
     * proyecto no la expone (`la propiedad 'text' no existe en tu sujeto`). La lectura para el log
     * se hace sobre el DOM crudo, que siempre ofrece `textContent`.
     */
    validateOrderNumberPresent() {
        const orderNumber = new RegExp(`${MESSAGES.ORDER_NUMBER_LABEL}\\s*:?\\s*\\d+`, 'i');

        cy.contains(orderNumber, { timeout: TIMEOUTS.ORDER_GENERATION }).should('be.visible');

        cy.document().then((doc) => {
            const match = doc.body.textContent.match(
                new RegExp(`${MESSAGES.ORDER_NUMBER_LABEL}\\s*:?\\s*(\\d+)`, 'i')
            );
            cy.log(`Orden generada n.º ${match ? match[1] : 'no legible'}`);
        });
    }
}

export default new OrderAsserts();
