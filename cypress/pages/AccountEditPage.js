import { UI_URLS } from '../support/constants/index';

const EDIT_FORM = '#profile-update-form';
const ENABLE_EDIT_BUTTON = 'button.update-info-btn';
const SAVE_BUTTON = 'button.save-info-btn';
const FIRST_NAME = 'input[name="first_name"]';

/**
 * Verificado contra el DOM real de /mi-cuenta/edit-account/: los BOTONES están duplicados por
 * breakpoint (dos "Actualizar Información" y dos "Guardar"), pero el formulario y sus campos son
 * únicos en el documento.
 *
 * De ahí la regla que sigue esta clase: `cy.getVisible` solo para accionar los botones duplicados;
 * `cy.get` directo para los campos. Filtrar los campos por `:visible` añadiría un requisito que no
 * necesitan —habilitar o leer un campo no exige que esté visible— y los deja fuera en cuanto el
 * formulario vuelve a su modo de solo lectura.
 */
class AccountEditPage {
    visit() {
        cy.visit(UI_URLS.EDIT_ACCOUNT);
        cy.get(EDIT_FORM).should('exist');
    }

    /** El formulario nace en solo lectura: hay que habilitar la edición antes de escribir. */
    enableEdit() {
        cy.getVisible(ENABLE_EDIT_BUTTON).click();
        cy.get(FIRST_NAME).should('be.enabled');
    }

    fillPersonalData(personalData) {
        cy.get(FIRST_NAME).clear().type(personalData.firstName);
        cy.get('input[name="last_name"]').clear().type(personalData.lastName);
        cy.get('input[name="birth_date"]').clear().type(personalData.birthDate);
        cy.get('select[name="gender"]').select(personalData.gender);
        cy.get('input[name="billing_phone"]').clear().type(personalData.billingPhone);
    }

    save() {
        cy.getVisible(SAVE_BUTTON).click();
    }
}

export default new AccountEditPage();
