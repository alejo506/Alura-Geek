/**
 * @file filterProducts.js
 * @description Este módulo gestiona la visualización y filtrado de productos en una tienda en línea.
 *
 * @module filterProducts
 * @requires conexionDB
 * @requires createProductCard
 *
 * @const {number} itemsPerPage - Número de productos por página.
 * @let {number} currentPage - Página actual que se está mostrando (inicialmente 1).
 * @const {HTMLElement} filterList - Elemento del DOM que contendrá la lista de productos.
 * @const {HTMLElement} searchInput - Campo de entrada para buscar productos.
 * @const {HTMLElement} paginationContainer - Contenedor de paginación de productos.
 */

/** Importaciones necesarias */
import { conexionDB } from "./conexionDB.js";
import createProductCard from "./getProducts.js"; 

/** Configuraciones iniciales */
const itemsPerPage = 6;
let currentPage = 1;
const filterList = document.querySelector("[data-list]");
const searchInput = document.querySelector("[data-search]");
const paginationContainer = document.querySelector(".paginacion");

/**
 * Renderiza una lista de productos en el DOM.
 *
 * @param {Array} products - Array de productos a renderizar.
 */
const renderProducts = (products) => {
    filterList.innerHTML = ""; // Limpia la lista de productos

    if (Array.isArray(products) && products.length) {
        products.forEach(product => {
            filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl, product.id)); // Crea y añade la tarjeta del producto
        });
    } else {
        filterList.innerHTML = `<h2 class="mensaje__Error-Titulo">No se encontraron elementos.</h2>`;
    }
};

/**
 * Renderiza todos los productos, utilizando paginación.
 *
 * @async
 * @param {number} [page=1] - Página a renderizar (opcional).
 */
const renderAllProducts = async (page = 1) => {
    try {
        const { products } = await conexionDB.listProducts(page, itemsPerPage);
        renderProducts(products);
    } catch (error) {
        console.error("Error al renderizar todos los productos:", error);
    }
};

/**
 * Filtra los productos por nombre según la entrada del usuario.
 *
 * @async
 */
const filterProductsByName = async () => {
    try {
        const prodFilter = searchInput.value.toLowerCase();

        if (!prodFilter) {
            paginationContainer.style.display = 'block';
            return renderAllProducts(currentPage);
        }

        // Llama a la función de la base de datos para filtrar productos
        const searchProduct = await conexionDB.filterProducts(prodFilter);

        if (!Array.isArray(searchProduct) || searchProduct.length === 0) {
            console.log("No se encontraron productos para este filtro.");
            paginationContainer.style.display = 'none';
            renderProducts([]); // Renderiza un mensaje de que no hay productos
            return;
        }

        paginationContainer.style.display = 'none';
        renderProducts(searchProduct);

    } catch (error) {
        console.error("Error al filtrar los productos:", error);
    }
};

/** Añade un evento de entrada para filtrar productos */
searchInput.addEventListener("input", filterProductsByName);
