import { conexionDB } from "./conexionDB.js";
import createProductCard from "./getProducts.js"; // Seguimos importando la función de creación de tarjetas

const itemsPerPage = 6;
let currentPage = 1;
const filterList = document.querySelector("[data-list]");
const searchInput = document.querySelector("[data-search]");
const paginationContainer = document.querySelector(".paginacion");

const renderProducts = (products) => {
    filterList.innerHTML = ""; // Limpia la lista de productos

    if (Array.isArray(products) && products.length) {
        products.forEach(product => {
            filterList.appendChild(createProductCard(product.productName, product.productPrice, product.productUrl, product.id)); // Asegúrate de que 'product.id' esté presente
        });
    } else {
        filterList.innerHTML = `<h2 class="mensaje__Error-Titulo">No se encontraron elementos.</h2>`;
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

searchInput.addEventListener("input", filterProductsByName);
