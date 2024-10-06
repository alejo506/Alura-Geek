import { conexionDB } from "./conexionDB.js";
import createProductCard from "./getProducts.js";
import { createPagination } from "./pagination.js"; // Asegúrate de tener acceso a la función de paginación

const itemsPerPage = 6; // Número de productos por página
let currentPage = 1; // Página actual

// Función para mostrar todos los productos
async function renderAllProducts(page = 1) {
    const data = await conexionDB.listProducts(page, itemsPerPage); // Obtener todos los productos

    const filterList = document.querySelector("[data-list]"); // Selecciona el contenedor donde se van a mostrar los productos

    // Limpiar la lista antes de mostrar los productos
    filterList.innerHTML = ""; // Elimina todos los productos mostrados anteriormente

    // Renderizar cada producto
    data.products.forEach(product => {
        filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl)); // Crea y agrega cada producto a la lista
    });

    // Llamar a la función de paginación si es necesario
    createPagination(data.totalItems, itemsPerPage, page, (newPage) => {
        currentPage = newPage;
        renderAllProducts(currentPage); // Actualizar la lista de productos con la nueva página
    });
}

// Función asíncrona que filtra los productos por nombre
async function filterProductsByName() {
    const prodFilter = document.querySelector("[data-search]").value.toLowerCase(); // Obtener el valor de la barra de búsqueda

    // Si el campo de búsqueda está vacío, renderiza todos los productos
    if (!prodFilter) {
        return renderAllProducts(currentPage); // Vuelve a mostrar todos los productos
    }

    // Obtener productos filtrados desde la base de datos
    const searchProduct = await conexionDB.filterProducts(prodFilter); // Filtra los productos llamando a una función en la base de datos

    const filterList = document.querySelector("[data-list]"); // Selecciona el contenedor donde se van a mostrar los productos

    // Limpiar la lista antes de mostrar los productos filtrados
    filterList.innerHTML = ""; // Elimina todos los productos mostrados anteriormente

    // Mostrar los productos filtrados
    searchProduct.forEach(product => {
        const productNameLower = product.productName.toLowerCase(); // Convertir el nombre del producto a minúsculas
        if (productNameLower.includes(prodFilter)) { // Comparar usando includes para verificar si el nombre contiene la búsqueda
            filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl)); // Crea y agrega cada producto filtrado a la lista
        }
    });

    // Mostrar mensaje si no se encontraron productos
    if (searchProduct.length === 0) {
        filterList.innerHTML = `<h2 class="mensaje__titulo">No se encontraron elementos para "${prodFilter}" :-(</h2>`; // Mensaje si no hay productos
    }
}

// Escuchar el evento 'input' para filtrar los productos en tiempo real
document.querySelector("[data-search]").addEventListener("input", filterProductsByName); // Filtra en tiempo real cuando el usuario escribe


   