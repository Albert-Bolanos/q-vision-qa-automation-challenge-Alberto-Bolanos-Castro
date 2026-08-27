import { TIMEOUTS } from '../constants/index';

/**
 * Departamento, Ciudad y País del checkout usan select2: su `<select>` original queda con la clase
 * `select2-hidden-accessible` y no acepta `.select()` nativo. Hay que abrir el desplegable y elegir
 * la opción en el widget. select2 genera un contenedor con id derivado del select original
 * (`#select2-<idOriginal>-container`), verificado presente en el DOM real del checkout.
 */
class Select2 {
    selectByText(originalSelectId, optionText) {
        const container = `#select2-${originalSelectId}-container`;

        cy.get(container).click();

        // select2 solo pinta el buscador cuando la lista supera cierto tamaño. Se consulta el DOM
        // crudo para no depender de la API del sujeto y se escribe solo si el buscador existe.
        cy.document().then((doc) => {
            if (doc.querySelector('.select2-container--open input.select2-search__field')) {
                cy.get('.select2-container--open input.select2-search__field').type(optionText);
            }
        });

        cy.get('.select2-container--open li.select2-results__option', {
            timeout: TIMEOUTS.SELECT2_OPTIONS
        })
            .contains(optionText)
            .click();

        cy.get(container).should('contain.text', optionText);
    }
}

export default new Select2();
