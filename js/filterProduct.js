import { conexionDB } from "./conexionDB.js";
import createProductCard from "./getProducts.js";
// import { createPagination } from "./pagination.js";

const itemsPerPage = 6;
let currentPage = 1;
const filterList = document.querySelector("[data-list]");
const searchInput = document.querySelector("[data-search]");
const paginationContainer = document.querySelector(".paginacion");

const renderProducts = (products) => {
    filterList.innerHTML = ""; // Limpia la lista de productos

    if (products.length) {
        products.forEach(product => {
            filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl));
        });
    } else {
        filterList.innerHTML = `<h2 class="mensaje__titulo">No se encontraron elementos.</h2>`;
    }
};

const renderAllProducts = async (page = 1) => {
    try {
        const { products } = await conexionDB.listProducts(page, itemsPerPage);
        renderProducts(products);
       
    } catch (error) {
        console.error("Error al renderizar todos los productos:", error);
    }
};

const filterProductsByName = async () => {
    try {
        const prodFilter = searchInput.value.toLowerCase();
        if (!prodFilter) {
            paginationContainer.style.display = 'block';
            return renderAllProducts(currentPage);
        }
        const searchProduct = await conexionDB.filterProducts(prodFilter);
        paginationContainer.style.display = 'none';
        renderProducts(searchProduct);
    } catch (error) {
        console.error("Error al filtrar los productos:", error);
    }
};

searchInput.addEventListener("input", filterProductsByName);
