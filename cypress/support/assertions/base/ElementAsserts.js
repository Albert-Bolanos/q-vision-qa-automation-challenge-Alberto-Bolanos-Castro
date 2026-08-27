/**
 * Las aserciones LEEN estado, no lo accionan, así que no filtran por `:visible`: exigir visibilidad
 * para comprobar el valor de un campo es un requisito que la aserción no necesita y que la rompe en
 * cuanto el control queda oculto (por ejemplo, un formulario que vuelve a su modo de solo lectura
 * tras guardar). El filtro `:visible` pertenece a las acciones — click, type, select —, donde sí
 * refleja lo que un usuario real puede hacer.
 */
class ElementAsserts {
    validateVisible(selector) {
        cy.get(selector).should('be.visible');
    }

    validateEnabled(selector) {
        cy.get(selector).should('not.have.class', 'disabled').and('not.be.disabled');
    }

    validateDisabled(selector) {
        cy.get(selector).should('have.class', 'disabled');
    }

    validateValue(selector, expectedValue) {
        cy.get(selector).should('have.value', expectedValue);
    }

    validateTextContain(selector, expectedText) {
        cy.get(selector).should('contain.text', expectedText);
    }

    validateTextPresent(expectedText, timeout) {
        cy.contains(expectedText, { timeout }).should('be.visible');
    }
}

export default new ElementAsserts();
