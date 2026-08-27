import select2 from '../support/utils/Select2';
import { TIMEOUTS } from '../support/constants/index';

const SUBMIT_ORDER_BUTTON = '#place_order';
const DATA_POLICY_CHECKBOX = '#terms';
const DOCUMENT_NUMBER = '#billing_user_login';

/**
 * Los campos se localizan por `id`, que es único por definición: no se filtran por `:visible`. Ese
 * filtro además rompería con cualquier control que select2 oculte para reemplazar por su propio
 * widget. Solo los botones con selector de clase —que el tema tiende a duplicar junto al nativo de
 * WooCommerce— pasan por cy.getVisible.
 */
class CheckoutPage {
    /** Paso 1 del checkout (Carrito): botón de continuar hacia Facturación. */
    continueFromCart() {
        cy.getVisible('button.resume-cta').click();
        cy.get('#billing_first_name').should('be.visible');
    }

    fillBillingData(billingData) {

        cy.get('#billing_tipo_documento').select(billingData.tipoDocumento);
        // El número de documento lo deriva el sitio de la cuenta autenticada y lo entrega en SOLO
        // LECTURA: no es un dato de prueba y no se escribe. Se verifica que llegue poblado, que es
        // lo único que el caso necesita de este campo.
        cy.get(DOCUMENT_NUMBER).should('have.attr', 'readonly');
        cy.get(DOCUMENT_NUMBER).should('not.have.value', '');
        cy.get('#billing_first_name').clear().type(billingData.firstName);
        cy.get('#billing_last_name').clear().type(billingData.lastName);
        cy.get('#billing_gender').select(billingData.gender);
        cy.get('#billing_email').clear().type(billingData.email);
        cy.get('#billing_phone').clear().type(billingData.phone);
        // País es select2 y la tienda ya lo trae preseleccionado en Colombia. Accionar un widget de
        // 251 opciones para reponer el valor que ya está sería fragilidad sin cobertura: se verifica.
        cy.get('#billing_country').should('have.value', billingData.countryCode);

        // Departamento y Ciudad sí son select2 sin valor por defecto. La lista de Ciudad se puebla en
        // función del Departamento elegido, por eso este orden es obligatorio.
        select2.selectByText('billing_state', billingData.state);
        select2.selectByText('billing_city', billingData.city);

        cy.get('#billing_address_1').clear().type(billingData.address);

        if (billingData.postcode) {
            cy.get('#billing_postcode').clear().type(billingData.postcode);
        }
    }

    acceptDataPolicy() {
        // Verificado en el DOM real del checkout: el consentimiento tiene id propio (#terms). Se
        // marca con force porque es un checkbox con estilo propio, no visible para Cypress.
        cy.get(DATA_POLICY_CHECKBOX).check({ force: true });
    }

    /**
     * El envío se localiza por `#place_order`, el id estándar de WooCommerce, y no por su texto: la
     * clase CSS `uppercase` lo MUESTRA como "REALIZAR EL PEDIDO", pero en el DOM dice "Realizar el
     * pedido", y cy.contains compara el texto real distinguiendo mayúsculas.
     *
     * La espera es condicional sobre el estado del botón (Cypress reintenta hasta cumplirla o agotar
     * el timeout), nunca un cy.wait fijo: habilitarlo depende de la validación asíncrona del
     * formulario, que dispara varias peticiones update_order_review.
     */
    submitOrder() {
        cy.get(SUBMIT_ORDER_BUTTON, { timeout: TIMEOUTS.ORDER_SUBMIT_READY })
            .should('be.visible')
            .and('be.enabled')
            .click();
    }
}

export default new CheckoutPage();
