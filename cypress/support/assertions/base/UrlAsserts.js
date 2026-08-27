import { TIMEOUTS } from '../../constants/index';

class UrlAsserts {
    validateUrlContains(fragment, timeout = TIMEOUTS.PAGE_LOAD) {
        cy.url({ timeout }).should('include', fragment);
    }

    validateUrlNotContains(fragment) {
        cy.url().should('not.include', fragment);
    }
}

export default new UrlAsserts();
