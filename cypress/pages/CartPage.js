import { UI_URLS } from '../support/constants/index';

class CartPage {
    visit() {
        cy.visit(UI_URLS.CART);
    }

    /**
     * El input de cantidad tiene name dinámico (cart[HASH][qty]): se ubica por su fila de producto,
     * nunca por un name fijo.
     */
    setQuantity(productName, quantity) {
        cy.contains('tr', productName).find('input.qty').clear().type(`${quantity}`);
    }

    removeProduct(productName) {
        cy.contains('tr', productName).find('a.remove').click();
    }

    goToCheckout() {
        cy.getVisible('a.checkout-button.wc-forward').click();
    }
}

export default new CartPage();
