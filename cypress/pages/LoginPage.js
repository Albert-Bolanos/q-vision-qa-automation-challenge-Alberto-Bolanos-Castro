import panelToggle from '../support/utils/PanelToggle';
import { UI_URLS } from '../support/constants/index';

const LOGIN_PANEL = '#customer_login';
const SHOW_LOGIN_TOGGLE = '#show_login';

/**
 * El formulario de acceso no tiene id propio, pero sus campos sí: #username y #password son únicos
 * en la página (el registro usa #reg_username / #reg_password). Vive en el panel #customer_login,
 * visible por defecto; se acciona el toggle solo si quedó oculto por haber abierto el registro.
 */
class LoginPage {
    visit() {
        cy.visit(UI_URLS.MY_ACCOUNT);
        this.openForm();
    }

    openForm() {
        panelToggle.show(LOGIN_PANEL, SHOW_LOGIN_TOGGLE);
        cy.get('#username').should('be.visible');
    }

    typeUsername(username) {
        cy.get('#username').clear().type(username);
    }

    typePassword(password) {
        cy.get('#password').clear().type(password, { log: false });
    }

    clickLogin() {
        cy.get('button[name="login"]').click();
    }

    login(username, password) {
        this.visit();
        this.typeUsername(username);
        this.typePassword(password);
        this.clickLogin();
    }
}

export default new LoginPage();
