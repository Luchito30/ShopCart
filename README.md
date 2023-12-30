# ShopCart: Proyecto Integrador de Luis Dick

**Proyecto Carrito de Compras 🛒**

```
Para iniciar el proyecto, es necesario ejecutar el siguiente comando en la consola: npm i. Este comando descargará todas las dependencias necesarias.

Posteriormente, para ejecutar el proyecto, se debe utilizar el comando: npm run dev. Esto iniciará el proyecto y generará un enlace local: http://localhost:5173/. Puedes acceder al proyecto a través de este enlace.
```

El proyecto ShopCart es una plataforma de comercio electrónico que ofrece productos consumidos desde una API de terceros: https://fakestoreapi.com/. La información obtenida incluye imágenes, títulos, descripciones y precios de los productos.

En la página de inicio, en el encabezado, podrás visualizar el nombre del proyecto, un carrito desactivado y un formulario de inicio de sesión. En el cuerpo de la página, se presentan los productos en forma de tarjetas.

Para agregar productos o habilitar el carrito, es necesario iniciar sesión. Se han creado dos usuarios estáticos para este propósito:

Usuario 1: username: user1, contraseña: password1
Usuario 2: username: 'user2', contraseña: 'password2'

Al iniciar sesión con cualquiera de estos dos usuarios, podrás agregar productos al carrito. Dentro del carrito, es posible seleccionar múltiples unidades del mismo producto, y el sistema calculará el precio total sumando la cantidad por el precio unitario.

Al finalizar la compra y hacer clic en "Comprar", se abrirá un modal de confirmación de compra. Este modal solicitará el método de pago, ofreciendo dos opciones:

**Efectivo:**

Se solicitará el correo electrónico y la dirección.
Al completar esta información, se finalizará la compra con un mensaje indicando que se enviará un correo electrónico con el comprobante de pago.
Una vez realizado el pago, el producto se enviará en un plazo de 48 horas.

**Pago con Tarjeta:**

Se pedirá al usuario que seleccione la tarjeta.
Se realizarán las verificaciones necesarias según el tipo de tarjeta seleccionada.