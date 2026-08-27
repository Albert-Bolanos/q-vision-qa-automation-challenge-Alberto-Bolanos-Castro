/**
 * La navegación de "Mi cuenta" está renderizada una vez por breakpoint (3 coincidencias por enlace),
 * así que cada pestaña se acciona sobre su variante visible.
 */
class AccountPage {
    goToPersonalData() {
        cy.getVisible('a[href*="mi-cuenta/edit-account"]').click();
    }

    goToOrders() {
        cy.getVisible('a[href*="mi-cuenta/orders"]').click();
    }
}

export default new AccountPage();
