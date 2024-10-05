import { conexionDB } from "./conexionDB.js";
import createProductCard from "./getProducts.js";

async function filterProductsByName() {
    const prodFilter = document.querySelector("[data-search]").value;

    // Obtener productos filtrados desde la base de datos
    const searchProduct = await conexionDB.filterProducts(prodFilter);

    const filterList = document.querySelector("[data-list]");

    // Limpiar la lista antes de mostrar los productos filtrados
    while (filterList.firstChild) {
        filterList.removeChild(filterList.firstChild);
    }

    // Mostrar los productos filtrados
    searchProduct.forEach(product => 
        filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl))
    );

    // Mostrar mensaje si no se encontraron productos
    if (searchProduct.length === 0) {
        filterList.innerHTML = `<h2 class="mensaje__titulo">No se encontraron elementos para "${prodFilter}"</h2>`;
    }
}

// Escuchar el evento 'input' para filtrar los productos en tiempo real
document.querySelector("[data-search]").addEventListener("input", filterProductsByName);
