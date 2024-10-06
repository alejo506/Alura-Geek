import { conexionDB } from "./conexionDB.js";
import createProductCard from "./getProducts.js";

// Función asíncrona que filtra los productos por nombre
async function filterProductsByName() {
    const prodFilter = document.querySelector("[data-search]").value.toLowerCase(); // Obtener el valor de la barra de búsqueda

    // Obtener productos filtrados desde la base de datos
    const searchProduct = await conexionDB.filterProducts(prodFilter); // Filtra los productos llamando a una función en la base de datos

    const filterList = document.querySelector("[data-list]"); // Selecciona el contenedor donde se van a mostrar los productos

    // Limpiar la lista antes de mostrar los productos filtrados
    while (filterList.firstChild) {
        filterList.removeChild(filterList.firstChild); // Elimina todos los productos mostrados anteriormente
    }

    // Mostrar los productos filtrados
    searchProduct.forEach(product => {
        const productNameLower = product.productName.toLowerCase(); // Convertir el nombre del producto a minúsculas
        if (productNameLower.includes(prodFilter)) { // Comparar usando includes para verificar si el nombre contiene la búsqueda
            filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl)); // Crea y agrega cada producto filtrado a la lista
        }
    });

    // Mostrar mensaje si no se encontraron productos
    if (searchProduct.length === 0) {
        filterList.innerHTML = `<h2 class="mensaje__titulo">No se encontraron elementos para "${prodFilter}" :-("</h2>`; // Mensaje si no hay productos
    }
}

// Escuchar el evento 'input' para filtrar los productos en tiempo real
document.querySelector("[data-search]").addEventListener("input", filterProductsByName); // Filtra en tiempo real cuando el usuario escribe
