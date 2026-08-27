import elementAsserts from './base/ElementAsserts';
import urlAsserts from './base/UrlAsserts';
import { UI_URLS } from '../constants/index';

class AccountAsserts {
    /**
     * La sesión se da por iniciada cuando el sitio deja de mostrar el formulario de acceso dentro
     * de "Mi cuenta". El sitio no expone un mensaje de éxito documentado, así que la evidencia es
     * la desaparición del gate de login, no un texto en pantalla.
     */
    validateSessionStarted() {
        urlAsserts.validateUrlContains(UI_URLS.MY_ACCOUNT);
        cy.get('#username').should('not.exist');
    }

    validateAccountCreated() {
        // El sitio no documenta mensaje ni selector de confirmación de registro: la evidencia real
        // de que la cuenta existe es que el formulario de registro ya no está disponible porque la
        // sesión quedó abierta. La verificación funcional definitiva la hace CP-01 al reingresar.
        cy.get('#reg_username').should('not.exist');
    }

    /**
     * Comprueba que el guardado se procesó. Al guardar, el formulario vuelve a su modo de solo
     * lectura: los inputs editables desaparecen del DOM y el botón "Actualizar Información" vuelve a
     * mostrarse en lugar de "Guardar". No se afirma nada sobre el marcado de esa vista de solo
     * lectura, que no está documentado — la comprobación de los valores la hace
     * validatePersonalData tras recargar el perfil.
     */
    validateChangesSaved() {
        cy.get('input[name="first_name"]').should('not.exist');
        cy.get('button.update-info-btn').filter(':visible').should('have.length.at.least', 1);
    }

    /**
     * Lee los valores almacenados desde los campos del formulario, que solo existen en el DOM cuando
     * la edición está habilitada. Por eso quien invoque esto debe abrir antes el modo de edición.
     */
    validatePersonalData(personalData) {
        elementAsserts.validateValue('input[name="first_name"]', personalData.firstName);
        elementAsserts.validateValue('input[name="last_name"]', personalData.lastName);
        elementAsserts.validateValue('input[name="birth_date"]', personalData.birthDate);
        elementAsserts.validateValue('input[name="billing_phone"]', personalData.billingPhone);
    }
}

export default new AccountAsserts();
