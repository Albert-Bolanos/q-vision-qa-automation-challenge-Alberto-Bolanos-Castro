require("dotenv").config();

const { defineConfig } = require("cypress");
const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");
const { addCucumberPreprocessorPlugin } = require("@badeball/cypress-cucumber-preprocessor");
const { createEsbuildPlugin } = require("@badeball/cypress-cucumber-preprocessor/esbuild");
const { allureCypress } = require("allure-cypress/reporter");

module.exports = defineConfig({
    e2e: {
        baseUrl: process.env.BONBONITE_BASE_URL || "https://www.bon-bonite.com",
        specPattern: "cypress/e2e/**/*.feature",
        supportFile: "cypress/support/e2e.js",
        // El tema usa el breakpoint `lg:` de Tailwind (1024px) y renderiza navegaciones distintas a
        // cada lado. El viewport por defecto de Cypress (1000x660) cae del lado movil, que no es la
        // variante sobre la que se documentaron los selectores. Se fija un viewport de escritorio.
        viewportWidth: 1440,
        viewportHeight: 900,
        defaultCommandTimeout: 15000,

        // El evento `load` no se dispara hasta que TODOS los recursos terminan de descargar. Las
        // páginas de categoría son archives de WooCommerce con decenas de imágenes de producto, más
        // la analítica de terceros que arrastra el sitio (Clarity, pixel de Facebook, Klaviyo,
        // CookieScript). Nada de eso pertenece al comportamiento bajo prueba, así que se bloquea:
        // acelera la carga y elimina una fuente de intermitencia ajena al sitio. El bloqueo NO altera
        // la funcionalidad que validan los casos — solo deja de descargar rastreadores.
        blockHosts: [
            '*clarity.ms',
            '*facebook.com',
            '*facebook.net',
            '*klaviyo.com',
            '*cookie-script.com',
            '*google-analytics.com',
            '*googletagmanager.com',
            '*doubleclick.net',
            '*hotjar.com'
        ],

        // Aun sin rastreadores, una archive de catálogo en producción es pesada. Se amplía el margen
        // de carga de página; es un límite de navegación, no una espera fija de sincronización.
        pageLoadTimeout: 120000,
        video: false,
        async setupNodeEvents(on, config) {
            await addCucumberPreprocessorPlugin(on, config);

            // Credenciales del usuario de pruebas: solo por variable de entorno, nunca con valor
            // por defecto en codigo. Si no estan definidas, CP-02 y CP-03 fallan de forma explicita.
            config.env.BONBONITE_USER = process.env.BONBONITE_USER;
            config.env.BONBONITE_PASSWORD = process.env.BONBONITE_PASSWORD;

            // Configurar Allure
            allureCypress(on, config, {
                resultsDir: "allure-results",
            });

            on(
                "file:preprocessor",
                createBundler({
                    plugins: [createEsbuildPlugin(config)],
                })
            );

            return config;
        },
    },
});
