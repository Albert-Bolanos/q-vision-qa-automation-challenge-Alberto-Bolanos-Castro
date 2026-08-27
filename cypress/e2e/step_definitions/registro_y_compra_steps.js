import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

import registerPage from '../../pages/RegisterPage';
import loginPage from '../../pages/LoginPage';
import accountPage from '../../pages/AccountPage';
import accountEditPage from '../../pages/AccountEditPage';
import categoryPage from '../../pages/CategoryPage';
import productPage from '../../pages/ProductPage';
import cartPage from '../../pages/CartPage';
import checkoutPage from '../../pages/CheckoutPage';

import PersonalData from '../../models/PersonalData';
import BillingData from '../../models/BillingData';

import dataFactory from '../../support/utils/DataFactory';
import { elementAsserts, urlAsserts, accountAsserts, orderAsserts } from '../../support/assertions/index';
import { UI_URLS } from '../../support/constants/index';

const PAGINAS = {
    'Mi cuenta': UI_URLS.MY_ACCOUNT
};

// Datos generados en tiempo de ejecución que un paso posterior necesita reutilizar.
// No son datos de negocio configurables: se generan porque deben ser únicos por corrida.
let registroGenerado;
let productoDePrueba;
let datosPersonales;

// ---------- Antecedentes ----------

Given('que ingreso a la página de inicio de sesión del sitio web de Bon-bonite', () => {
    cy.visit(UI_URLS.MY_ACCOUNT);
});

// ---------- CP-01: Registro exitoso de un nuevo usuario ----------

When('diligencio el formulario de registro con datos válidos y únicos', () => {
    // /mi-cuenta/ abre en el panel de inicio de sesión: hay que mostrar el de registro antes de
    // escribir, o sus campos existen en el DOM pero permanecen invisibles.
    registerPage.openForm();

    cy.fixture('registro').then((plantilla) => {
        registroGenerado = dataFactory.buildRegistrationData(plantilla);
        registerPage.fillForm(registroGenerado);
    });
});

When('acepto la política de privacidad', () => {
    registerPage.acceptPrivacyPolicy();
});

When('confirmo el registro', () => {
    registerPage.submit();
});

Then('el sistema crea la cuenta del nuevo usuario', () => {
    accountAsserts.validateAccountCreated();
});

Then('al iniciar sesión con las credenciales registradas accedo a {string}', (nombrePagina) => {
    // Se descarta la sesión abierta por el registro para probar el login real con las credenciales
    // recién creadas. El sitio no documenta un selector de cierre de sesión, así que la sesión se
    // corta limpiando cookies y almacenamiento en vez de depender de un enlace no documentado.
    cy.clearCookies();
    cy.clearLocalStorage();

    cy.visit(PAGINAS[nombrePagina]);
    loginPage.openForm();

    loginPage.typeUsername(registroGenerado.username);
    loginPage.typePassword(registroGenerado.password);
    loginPage.clickLogin();

    accountAsserts.validateSessionStarted();
});

// ---------- Paso compartido por CP-02 y CP-03 ----------

Given('que inicio sesión con el usuario de pruebas configurado', () => {
    // Antecedentes ya dejó el navegador en /mi-cuenta/: basta con asegurar que el panel visible
    // es el de inicio de sesión, sin recargar la página.
    loginPage.openForm();
    cy.iniciarSesionConUsuarioDePruebas();
    accountAsserts.validateSessionStarted();
});

// ---------- CP-02: Modificación de los datos de un usuario registrado ----------

When('accedo a la pestaña {string} de {string}', (pestaña) => {
    expect(pestaña, 'Solo está implementada la pestaña "Datos"').to.eq('Datos');
    accountPage.goToPersonalData();
    urlAsserts.validateUrlContains('edit-account');
});

When('habilito la edición de la información personal', () => {
    accountEditPage.enableEdit();
});

When('modifico los datos personales con los nuevos valores', () => {
    cy.fixture('datosPersonales').then((datos) => {
        datosPersonales = new PersonalData(datos);
        accountEditPage.fillPersonalData(datosPersonales);
    });
});

When('guardo los cambios', () => {
    accountEditPage.save();
});

Then('el sistema actualiza la información del usuario', () => {
    accountAsserts.validateChangesSaved();
});

Then('al volver a consultar el perfil los datos personales muestran los nuevos valores', () => {
    // La verificación de persistencia se hace recargando el perfil desde el servidor, no sobre el
    // estado que quedó en pantalla tras guardar. Los valores almacenados solo son legibles con la
    // edición habilitada: en modo de solo lectura los inputs no existen en el DOM.
    accountEditPage.visit();
    accountEditPage.enableEdit();
    accountAsserts.validatePersonalData(datosPersonales);
});

// ---------- CP-03: Compra exitosa hasta la generación de la orden ----------

When('accedo al módulo de categoría del producto de prueba', () => {
    cy.fixture('productoDePrueba').then((producto) => {
        productoDePrueba = producto;
        categoryPage.openFromMenu(producto.categoriaSlug);
    });
});

When('abro la ficha del producto de prueba', () => {
    productPage.visit(productoDePrueba.productoSlug);
});

When('selecciono la talla del producto', () => {
    productPage.selectSize(productoDePrueba.talla);
});

Then('el botón {string} queda habilitado', () => {
    // La comprobación de "habilitado" por sí sola es vacua aquí: el HTML servido NO trae la clase
    // `disabled` — es WooCommerce quien la agrega al inicializarse y la quita al elegir variación.
    // Sin exigir además que el botón esté visible, la aserción pasaría igual si el JavaScript de la
    // variación nunca hubiera corrido. El bloque de compra permanece oculto hasta que hay variación
    // válida, así que la visibilidad es la señal real de que el producto quedó listo para comprar.
    elementAsserts.validateVisible(productPage.addToCartButton);
    elementAsserts.validateEnabled(productPage.addToCartButton);
});

When('agrego el producto al carrito', () => {
    productPage.addToCart();
});

When('finalizo la compra desde el carrito', () => {
    cartPage.visit();
    cartPage.goToCheckout();
});

When('diligencio el formulario de facturación con los datos de prueba', () => {
    checkoutPage.continueFromCart();
    cy.fixture('datosFacturacion').then((datos) => {
        checkoutPage.fillBillingData(new BillingData(datos));
    });
});

When('autorizo el tratamiento de mis datos personales', () => {
    checkoutPage.acceptDataPolicy();
});

When('realizo el pedido', () => {
    checkoutPage.submitOrder();
});

Then('el sistema genera la orden de compra', () => {
    orderAsserts.validateOrderGenerated();
});

Then('la orden generada muestra su número de pedido', () => {
    orderAsserts.validateOrderNumberPresent();
});
