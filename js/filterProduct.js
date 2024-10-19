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

// Inicialmente deshabilitar el autocompletado del buscador
searchInput.setAttribute('autocomplete', 'off');



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
// Al realizar busquedas y eliminar el filtro de manera rapida, desaparecia la paginacion, por esa razon utilizamos un debounce (retardo) que evite que el código se ejecute de inmediato cada vez que se cambia el valor en el campo de búsqueda. Esto le dará tiempo a la interfaz para procesar los cambios antes de actualizar la paginación y la lista de productos.
let debounceTimeout; // Variable para manejar el tiempo del debounce

const filterProductsByName = async () => {
    clearTimeout(debounceTimeout); // Limpia el tiempo de espera previo

    debounceTimeout = setTimeout(async () => { // Establece un nuevo tiempo de espera
        try {
            const prodFilter = searchInput.value.toLowerCase().trim(); // Elimina espacios vacíos

            // Si la barra de búsqueda está vacía, mostrar todos los productos
            if (!prodFilter) {
                paginationContainer.style.display = 'block'; // Mostrar la paginación
                currentPage = 1; // Reiniciar a la primera página
                return renderAllProducts(currentPage); // Renderiza todos los productos
            }

            // Si hay un filtro, buscar productos filtrados
            const searchProduct = await conexionDB.filterProducts(prodFilter);

            if (!Array.isArray(searchProduct) || searchProduct.length === 0) {
                console.log("No se encontraron productos para este filtro.");
                paginationContainer.style.display = 'none'; // Ocultar la paginación si no hay productos
                renderProducts([]); // Renderiza un mensaje de que no hay productos
                return;
            }

            // Si se encuentran productos, renderizarlos y ocultar la paginación
            paginationContainer.style.display = 'none'; // Ocultar la paginación durante la búsqueda
            renderProducts(searchProduct);

        } catch (error) {
            console.error("Error al filtrar los productos:", error);
        }
    }, 300); // Tiempo de espera de 300ms para ejecutar la búsqueda
};

const icon = document.querySelector('#search-icon');

// Añadir el evento al input de búsqueda
searchInput.addEventListener('input',  (event) => {
    event.preventDefault();
    filterProductsByName();
    //Cuando se escribe se ejecuta la animacion del icono
    icon.setAttribute('trigger', 'loop'); // Activar animación
});


// Cuando el input pierde el foco, volvemos a la configuración original
searchInput.addEventListener('blur', () => {
    icon.setAttribute('trigger', 'hover'); // Restablecer a hover
});