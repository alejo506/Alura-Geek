# 🛍️ Product Management Application

## 📜 Descripción
Esta es una aplicación web para administrar productos utilizando JavaScript, HTML y CSS. Permite realizar diversas operaciones sobre una base de datos de productos, como agregar, eliminar, actualizar y filtrar elementos.

## 🌟 Características
- **Interfaz de usuario amigable**: Diseño simple y accesible.
- **Gestión de productos**: Añadir, eliminar, actualizar y filtrar productos.
- **Notificaciones**: Integración de SweetAlert para mostrar alertas y mensajes.
- **Iconos**: Uso de Lordicon para mejorar la experiencia visual.

## 🗂️ Módulos
La aplicación se compone de varios módulos, cada uno con una función específica:

- **`conexionDB.js`**: Maneja la conexión a la base de datos.
- **`getProducts.js`**: Recupera la lista de productos.
- **`postProducts.js`**: Agrega nuevos productos a la base de datos.
- **`deleteProducts.js`**: Elimina productos existentes.
- **`filterProduct.js`**: Filtra la lista de productos según criterios específicos.
- **`pagination.js`**: Maneja la paginación de productos.
- **`validate.js`**: Valida los datos de entrada.
- **`updateProduct.js`**: Actualiza la información de productos existentes.
- **`soundButtons.js`**: Agrega efectos de sonido a los botones.
- **`title.js`**: Maneja efectos en el título de la aplicación.

## 🗄️ Base de Datos
Utilizo **MockAPI** para almacenar la base de datos llamada **productos**, que contiene los siguientes campos:

- **`productName`**: Nombre del producto.
- **`productPrice`**: Precio del producto.
- **`productUrl`**: URL de la imagen del producto.
