# testing-q-vision

Automatización E2E del sitio web de **Bon-bonite** (`https://www.bon-bonite.com/`, WordPress +
WooCommerce) con **Cypress + Cucumber**.

## Requisitos

- Node.js 18+
- `npm install`
- Copiar `.env.example` a `.env` y completar las credenciales del usuario de pruebas.

## Ejecución

```bash
npm run cy:open          # modo interactivo
npm run cy:run           # los 3 escenarios
npm run cy:run:registro  # solo CP-01
npm run cy:run:datos     # solo CP-02
npm run cy:run:compra    # solo CP-03
npm run cy:run:allure && npm run allure:report   # con reporte Allure
```

## Escenarios

| Tag | Caso | Alcance |
|---|---|---|
| `@CP-01` | Registro exitoso de un nuevo usuario | Registro con datos únicos + verificación por inicio de sesión real |
| `@CP-02` | Modificación de datos del usuario registrado | Edición en `/mi-cuenta/edit-account/` + verificación por reconsulta del perfil |
| `@CP-03` | Compra de un producto | Categoría → producto → talla → carrito → checkout → **orden generada** (sin pago en Wompi) |

## Estructura

```
cypress/
  e2e/features/            escenarios en Gherkin (español), un tag por caso
  e2e/step_definitions/    glue Cucumber; sin cy.get suelto
  pages/                   page objects UI (singleton), dueños de los selectores
  models/                  DTOs de datos (RegistrationData, PersonalData, BillingData)
  fixtures/                datos de negocio editables — agregar un caso NO toca código
  support/
    assertions/base/       asserts genéricos reutilizables
    assertions/            asserts de dominio compuestos sobre los base
    constants/             urls, mensajes y timeouts (sin números mágicos sueltos)
    commands/              comandos custom (inicio de sesión)
    utils/                 DataFactory (datos únicos), Select2 (helper del checkout)
```

## Dónde vive cada dato

| Tipo de dato | Dónde | Por qué |
|---|---|---|
| URL base, usuario y contraseña de pruebas | `.env` (vía `Cypress.env`) | Varían por **ambiente**. Los secretos no tienen valor por defecto: si faltan, el test falla con mensaje explícito. |
| Datos de facturación, datos personales, producto de prueba | `cypress/fixtures/*.json` | Varían por **caso** y se reutilizan entre escenarios. Editarlos no toca código. |
| Usuario/cédula y email de registro | Generados en `DataFactory` | Deben ser **únicos por corrida**: WordPress rechaza duplicados. Un fixture fijo haría fallar CP-01 desde la segunda ejecución. |

## Reglas de calidad aplicadas

- **Ninguna espera fija como mecanismo de sincronización.** Toda espera es condicional sobre el estado
  real (URL, visibilidad, estado del botón), con timeouts nombrados en `support/constants/timeouts.js`.
  La única pausa fija del proyecto está entre reintentos de un toggle de CSS local, documentada en
  `support/utils/PanelToggle.js`.
- **Sin selectores en los steps.** Los steps orquestan page objects; los page objects son los únicos
  dueños de los selectores.
- **Sin `expect()` suelto en los steps.** Toda aserción pasa por la capa `support/assertions/`.
- **Sin secretos en código.** Solo variables de entorno, sin valor por defecto.
