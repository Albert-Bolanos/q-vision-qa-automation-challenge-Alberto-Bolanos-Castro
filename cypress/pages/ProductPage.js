import { UI_URLS } from '../support/constants/index';

const VARIATIONS_FORM = 'form.variations_form.cart';
const SIZE_SELECT = '#pa_talla';
// El botón se acota al bloque de variación de WooCommerce: `single_add_to_cart_button` a secas
// aparece más de una vez en la página.
const ADD_TO_CART_BUTTON = '.woocommerce-variation-add-to-cart button.single_add_to_cart_button';

const sizeButton = (size) =>
    `button.variation-button[data-attribute_name="attribute_pa_talla"][data-value="${size}"]`;

class ProductPage {
    visit(productSlug) {
        cy.visit(UI_URLS.product(productSlug));
        cy.get(VARIATIONS_FORM).should('be.visible');
    }

    /**
     * Los botones de talla son la UI propia del tema; WooCommerce solo reacciona cuando ese click se
     * propaga al `<select name="attribute_pa_talla">` nativo, que el tema mantiene oculto. Verificar
     * ese select distingue "la talla quedó seleccionada" de "el click no llegó a ninguna parte" —
     * modo de fallo real en este sitio, donde los handlers se conectan en DOMContentLoaded.
     */
    selectSize(size) {
        cy.get(sizeButton(size)).click();
        cy.get(SIZE_SELECT).should('have.value', size);
    }

    get addToCartButton() {
        return ADD_TO_CART_BUTTON;
    }

    addToCart() {
        cy.get(ADD_TO_CART_BUTTON).click();
    }
}

export default new ProductPage();
