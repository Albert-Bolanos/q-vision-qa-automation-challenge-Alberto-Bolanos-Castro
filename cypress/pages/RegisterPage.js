import panelToggle from '../support/utils/PanelToggle';
import { UI_URLS } from '../support/constants/index';

const REGISTER_FORM = '#form-register';
const REGISTER_PANEL = '#customer_register';
const SHOW_REGISTER_TOGGLE = '#show_register';

/**
 * En /mi-cuenta/ conviven dos paneles: #customer_login (visible por defecto) y #customer_register,
 * que nace con la clase `hidden` (display:none). El sitio alterna entre ambos con los enlaces
 * #show_register / #show_login, que solo agregan o quitan esa clase. Sin accionar el toggle, todos
 * los campos del registro existen en el DOM pero son invisibles y Cypress rechaza escribir en ellos.
 */
class RegisterPage {
    visit() {
        cy.visit(UI_URLS.MY_ACCOUNT);
        this.openForm();
    }

    /** Muestra el panel de registro. Es idempotente: si ya está visible, no hace nada. */
    openForm() {
        panelToggle.show(REGISTER_PANEL, SHOW_REGISTER_TOGGLE);
        cy.get(REGISTER_PANEL).should('not.have.class', 'hidden');
        cy.get(REGISTER_FORM).should('be.visible');
    }

    fillForm(registrationData) {
        cy.get('#reg_username').clear().type(registrationData.username);
        cy.get('#first_name').clear().type(registrationData.firstName);
        cy.get('#last_name').clear().type(registrationData.lastName);
        cy.get('#reg_email').clear().type(registrationData.email);
        cy.get('#reg_password').clear().type(registrationData.password, { log: false });
        cy.get('#reg_password2').clear().type(registrationData.password, { log: false });
    }

    acceptPrivacyPolicy() {
        cy.get('#privacy_policy_reg').check({ force: true });
    }

    submit() {
        cy.get('button[name="register"]').click();
    }
}

export default new RegisterPage();
