# testing-q-vision

Automatización E2E del sitio web de **Bon-bonite** (`https://www.bon-bonite.com/`, WordPress +
WooCommerce) con **Cypress + Cucumber**.

Generado por [`qa-copilot-kit`](../../qa-copilot-kit) — proyecto `projects/q-vision`.
Test plan y casos de origen: `projects/q-vision/outputs/registro-y-compra/`.

## ⚠️ El SUT es producción

No existe ambiente de pruebas. Cada ejecución de **CP-01 crea un usuario real** y cada ejecución de
**CP-03 genera una orden real**. Acordar frecuencia y limpieza con el negocio antes de integrar esto a
un pipeline. Ver riesgo R-01 del test plan.

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
  e2e/features/            .feature en español, copia fiel del artefacto de MVP0
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
| Usuario/cédula y email de registro | Generados en `DataFactory` | Deben ser **únicos por corrida**: WordPress rechaza duplicados (R-06). Un fixture fijo haría fallar CP-01 desde la segunda ejecución. |

## Pendientes de confirmar contra el sitio real

Estos valores se dejaron declarados en fixtures pero **no están validados** contra el sitio (el
documento técnico lista los campos, no valores aceptados). Es lo primero a ajustar en la primera
corrida:

- `datosFacturacion.json`: `tipoDocumento`, `gender`, `country`, `state`, `city` se seleccionan por
  **texto visible**. Si las opciones reales difieren, ajustar el fixture — no el código.
- ~~`datosPersonales.json`: `gender`~~ — **confirmado** contra el DOM real: el `select` acepta
  exactamente `Masculino`, `Femenino` y `Otro`. El fixture ya usa un valor válido.
- `productoDePrueba.json`: el producto y la talla deben tener **stock**. Si se agotan, CP-03 falla por
  inventario, no por defecto del sitio (R-04).
- Cierre de sesión: el sitio no documenta selector de logout. CP-01 corta la sesión limpiando cookies y
  `localStorage` en vez de depender de un enlace no documentado.

## Banner de cookies: deliberadamente no se maneja

`/mi-cuenta/` carga un banner de consentimiento del proveedor externo **CookieScript**, inyectado desde
un CDN después de la carga. En ejecución real aparece su contenedor `#cookiescript_injected` pero no un
control de aceptación localizable (ni `#cookiescript_accept` ni el texto "ACEPTAR TODO"), y no
intercepta ninguna interacción de los tres escenarios. Aceptarlo era una espera sin cobertura asociada,
así que se eliminó del `Antecedentes`.

Si en el futuro un escenario falla con un error de **elemento cubierto por otro** (no de elemento
ausente), este banner es el primer sospechoso: significaría que el proveedor cambió su configuración a
una capa modal. Ver R-07 del test plan.

## Terceros bloqueados

`cypress.config.js` bloquea vía `blockHosts` la analítica de terceros del sitio (Clarity, pixel de
Facebook, Klaviyo, CookieScript, Google Analytics/Tag Manager, DoubleClick, Hotjar). El evento `load`
no se dispara hasta que **todos** los recursos terminan de descargar, y las páginas de categoría son
archives de WooCommerce pesadas: sin este bloqueo, la navegación al módulo agota el `pageLoadTimeout`.

El bloqueo no altera la funcionalidad bajo prueba — solo evita descargar rastreadores. Como efecto
lateral, CookieScript ya no se carga en absoluto, lo que refuerza la decisión de no manejar su banner
(ver sección siguiente).

## Viewport

Fijado en **1440x900** (`cypress.config.js`). El tema usa el breakpoint `lg:` de Tailwind (1024px) y
renderiza navegaciones distintas a cada lado; el viewport por defecto de Cypress (1000x660) cae del lado
móvil, que no es la variante sobre la que se documentaron los selectores. Además, la navegación de
"Mi cuenta" está duplicada en el documento (una variante por breakpoint), por lo que los enlaces de
pestaña se acotan siempre a la variante visible antes de accionarlos.

## Cuándo usar `cy.getVisible`

El tema duplica controles: renderiza su propia versión junto a la nativa de WooCommerce, y repite
bloques de navegación por breakpoint. Pero **no** duplica los campos de formulario ni nada localizado
por `id`. Verificado sobre el DOM real: la navegación de "Mi cuenta" aparece 3 veces por enlace, los
botones del perfil 2 veces y `single_add_to_cart_button` 2 veces; los campos del perfil, el formulario
de variaciones y cada botón de talla son únicos.

De ahí la regla:

| Caso | Localizador |
|---|---|
| **Acción** sobre un control de clase que el tema duplica | `cy.getVisible(...)` |
| Cualquier cosa con `id` | `cy.get(...)` — un `id` ya es único, y `:visible` rompe con los controles que select2 oculta |
| Campos de formulario | `cy.get(...)` |
| **Aserciones**, siempre | `cy.get(...)` — leer estado no exige visibilidad |

Aplicar `:visible` fuera de esos casos no es una precaución inocua: descarta el elemento y produce un
"never found it" que parece un selector equivocado cuando en realidad es un filtro de más.

## Reglas de calidad aplicadas

- **Sin `cy.wait(ms)` fijo.** Toda espera es condicional sobre el estado real (URL, texto del botón,
  visibilidad), con timeouts nombrados en `support/constants/timeouts.js`.
- **Sin selectores en los steps.** Los steps orquestan page objects; los page objects son los únicos
  dueños de los selectores.
- **Sin `expect()` suelto en los steps.** Toda aserción pasa por la capa `support/assertions/`.
- **Sin secretos en código.** Solo variables de entorno, sin valor por defecto.
