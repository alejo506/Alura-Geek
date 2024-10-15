/**
 * @file conexionDB.js
 * @description Este módulo se encarga de la conexión a la API de productos y proporciona
 * funciones para gestionar productos en la base de datos. Permite realizar operaciones
 * como listar, enviar, filtrar, eliminar y actualizar productos.
 *
 * @module conexionDB
 * @const {string} API_URL - URL base para la API de productos.
 */

/** Configuración de la API */
const API_URL = "https://67099631af1a3998baa1e796.mockapi.io/products_geek/";

/**
 * Obtiene el total de productos disponibles en la API.
 *
 * @async
 * @returns {number} - Total de productos.
 */
async function getTotalProducts() {
    const response = await fetch(`${API_URL}products`);
    const data = await response.json();
    return data.length; // Devuelve el conteo total de productos
}

/**
 * Lista los productos con paginación.
 *
 * @async
 * @param {number} offset - Número de página actual.
 * @param {number} limit - Número de productos a mostrar por página.
 * @returns {Object} - Objeto que contiene la lista de productos y el total de productos.
 */
async function listProducts(offset, limit) {
    // Envía una solicitud para obtener productos con paginación
    const response = await fetch(`${API_URL}products?page=${offset}&limit=${limit}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        }
    });

    // Convierte la respuesta en formato JSON
    const data = await response.json();

    // Obtiene el total de productos
    const totalItems = await getTotalProducts();

    // Retorna los productos y el total de productos
    return {
        products: data, // Lista de productos
        totalItems: totalItems ? parseInt(totalItems) : 0 // Total de productos como número
    };
}

/**
 * Envía un nuevo producto a la API.
 *
 * @async
 * @param {string} productName - Nombre del producto.
 * @param {number} productPrice - Precio del producto.
 * @param {string} productUrl - URL de la imagen del producto.
 * @returns {Object} - Objeto que representa el producto creado.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
async function sendProducts(productName, productPrice, productUrl) {
    // Crea un nuevo producto en formato JSON
    const newProduct = {
        productName: productName,
        productPrice: productPrice,
        productUrl: productUrl
    };

    // Envía una solicitud para crear un nuevo producto
    const response = await fetch(`${API_URL}products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        },
        body: JSON.stringify(newProduct) // Envía el producto en formato JSON
    });

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
        throw new Error(`Error al enviar el producto: ${response.status}`); // Lanza error si falla
    }

    // Convierte la respuesta a formato JSON
    return await response.json(); // Retorna el producto creado
}

/**
 * Filtra productos por nombre.
 *
 * @async
 * @param {string} keyWord - Palabra clave para filtrar productos.
 * @returns {Array} - Lista de productos filtrados.
 */
async function filterProducts(keyWord) {
    // Envía una solicitud para buscar productos por nombre
    const response = await fetch(`${API_URL}products?productName=${keyWord}`);

    // Convierte la respuesta a formato JSON
    return await response.json(); // Retorna la lista de productos filtrados
}

/**
 * Elimina un producto por ID.
 *
 * @async
 * @param {string} productId - ID del producto a eliminar.
 * @returns {boolean} - Verdadero si se eliminó con éxito, falso si hubo un error.
 */
export async function deleteProduct(productId) {
    // Envía una solicitud para eliminar un producto por ID
    const response = await fetch(`${API_URL}products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        }
    });

    // Verifica si la eliminación fue exitosa
    if (response.ok) {
        console.log("Producto eliminado con éxito"); // Mensaje de éxito
        return true; // Retorna true si fue exitoso
    } else {
        console.error("Error al eliminar el producto"); // Mensaje de error
        return false; // Retorna false si hubo un error
    }
}

/**
 * Obtiene un producto por ID.
 *
 * @async
 * @param {string} productId - ID del producto a obtener.
 * @returns {Object} - Datos del producto.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
async function getProductById(productId) {
    const response = await fetch(`${API_URL}products/${productId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        }
    });

    if (!response.ok) {
        throw new Error(`Error al obtener el producto: ${response.status}`);
    }

    return await response.json(); // Retorna los datos del producto
}

/**
 * Actualiza un producto existente.
 *
 * @async
 * @param {string} productId - ID del producto a actualizar.
 * @param {string} productName - Nuevo nombre del producto.
 * @param {number} productPrice - Nuevo precio del producto.
 * @param {string} productUrl - Nueva URL de la imagen del producto.
 * @returns {Object} - Objeto que representa el producto actualizado.
 * @throws {Error} - Lanza un error si la solicitud falla.
 */
async function updateProduct(productId, productName, productPrice, productUrl) {
    const updatedProduct = {
        productName: productName,
        productPrice: productPrice,
        productUrl: productUrl
    };

    const response = await fetch(`${API_URL}products/${productId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    });

    if (!response.ok) {
        throw new Error(`Error al actualizar el producto: ${response.status}`);
    }

    return await response.json(); // Retorna el producto actualizado
}

// ! Exportar funciones para ser utilizadas en otras partes de la aplicación
export const conexionDB = {
    listProducts,   // Función para listar productos
    sendProducts,   // Función para enviar un nuevo producto
    filterProducts, // Función para filtrar productos por nombre
    deleteProduct,   // Función para eliminar un producto
    getProductById,  // Función para obtener un producto por su id
    updateProduct    // Función para actualizar un producto
};
