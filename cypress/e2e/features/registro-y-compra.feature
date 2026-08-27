# language: es
Característica: Registro, gestión de cuenta y compra en el sitio web de Bon-bonite

  Antecedentes:
    Dado que ingreso a la página de inicio de sesión del sitio web de Bon-bonite

  @CP-01
  Escenario: HU-123 - Registro exitoso de un nuevo usuario
    Cuando diligencio el formulario de registro con datos válidos y únicos
    Y acepto la política de privacidad
    Y confirmo el registro
    Entonces el sistema crea la cuenta del nuevo usuario
    Y al iniciar sesión con las credenciales registradas accedo a "Mi cuenta"

  @CP-02
  Escenario: HU-123 - Modificación de los datos de un usuario registrado
    Dado que inicio sesión con el usuario de pruebas configurado
    Cuando accedo a la pestaña "Datos" de "Mi cuenta"
    Y habilito la edición de la información personal
    Y modifico los datos personales con los nuevos valores
    Y guardo los cambios
    Entonces el sistema actualiza la información del usuario
    Y al volver a consultar el perfil los datos personales muestran los nuevos valores

  @CP-03
  Escenario: HU-123 - Compra exitosa de un producto hasta la generación de la orden
    Dado que inicio sesión con el usuario de pruebas configurado
    Cuando accedo al módulo de categoría del producto de prueba
    Y abro la ficha del producto de prueba
    Y selecciono la talla del producto
    Entonces el botón "Añadir al carrito" queda habilitado
    Cuando agrego el producto al carrito
    Y finalizo la compra desde el carrito
    Y diligencio el formulario de facturación con los datos de prueba
    Y autorizo el tratamiento de mis datos personales
    Y realizo el pedido
    Entonces el sistema genera la orden de compra
    Y la orden generada muestra su número de pedido
