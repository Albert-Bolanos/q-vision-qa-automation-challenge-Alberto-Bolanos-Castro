import loginPage from '../../pages/LoginPage';

/**
 * Devuelve la variante VISIBLE de un selector.
 *
 * El tema de Bon-bonite renderiza el mismo bloque más de una vez en el documento, una variante por
 * breakpoint de Tailwind. Por eso muchos selectores coinciden con 2 o 3 elementos y cualquier acción
 * sobre ellos falla con "can only be called on a single element" — se confirmó en la navegación de
 * "Mi cuenta" (3 coincidencias) y en el botón de habilitar edición del perfil (2). La variante visible
 * es la única que un usuario real accionaría en el viewport actual.
 *
 * NO usar con controles deliberadamente ocultos: los checkboxes con estilo propio y el <select>
 * original que reemplaza select2 nunca son ":visible", y se accionan con { force: true } sobre el
 * selector directo.
 */
Cypress.Commands.add('getVisible', (selector) => cy.get(selector).filter(':visible').first());

/**
 * Inicia sesión con el usuario de pruebas. Las credenciales viven solo en variables de entorno,
 * sin valor por defecto: si faltan, el comando falla con un mensaje explícito en vez de intentar
 * autenticarse con datos vacíos.
 */
Cypress.Commands.add('iniciarSesionConUsuarioDePruebas', () => {
    const usuario = Cypress.env('BONBONITE_USER');
    const password = Cypress.env('BONBONITE_PASSWORD');

    expect(usuario, 'Falta la variable de entorno BONBONITE_USER (ver .env.example)').to.be.a(
        'string'
    ).and.not.be.empty;
    expect(
        password,
        'Falta la variable de entorno BONBONITE_PASSWORD (ver .env.example)'
    ).to.be.a('string').and.not.be.empty;

    loginPage.typeUsername(usuario);
    loginPage.typePassword(password);
    loginPage.clickLogin();
});
