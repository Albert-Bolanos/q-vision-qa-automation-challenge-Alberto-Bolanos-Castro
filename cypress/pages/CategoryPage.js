import { UI_URLS } from '../support/constants/index';

class CategoryPage {
    visit(categorySlug) {
        cy.visit(UI_URLS.category(categorySlug));
    }

    /** Navega al módulo desde el menú del sitio, ejercitando el enlace real de la categoría. */
    openFromMenu(categorySlug) {
        cy.get(`a[href*="categoria-producto/${categorySlug}"]`).first().click({ force: true });
        cy.url().should('include', categorySlug);
    }
}

export default new CategoryPage();
