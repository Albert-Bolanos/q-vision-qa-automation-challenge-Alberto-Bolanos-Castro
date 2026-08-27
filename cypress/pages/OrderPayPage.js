import { MESSAGES } from '../support/constants/index';

/**
 * Página de pago. Es la frontera del alcance automatizado: la orden ya está generada y el pago
 * se delega a Wompi (pasarela externa). El botón de pago se expone para dejar explícito dónde
 * termina la prueba, pero NO se acciona.
 */
class OrderPayPage {
    get orderNumberLabel() {
        return cy.contains(MESSAGES.ORDER_NUMBER_LABEL);
    }

    get wompiButton() {
        return cy.get('button.waybox-button');
    }
}

export default new OrderPayPage();
