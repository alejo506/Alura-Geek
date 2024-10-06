import { conexionDB } from "./conexionDB.js";
import { createPagination } from "./pagination.js";

const ulList = document.querySelector("[data-list]");
const itemsPerPage = 6; // Número de productos por página
let currentPage = 1; // Página actual

// Función para crear una tarjeta de producto
export default function createProductCard(productName, productPrice, productUrl) {
    const product = document.createElement('li');
    product.className = "product-list__item";

    product.innerHTML = `
        <img src="${productUrl}" alt="Product 1 - Description of product" class="product-list__image" itemprop="image">
        <h3 class="product-list__name" itemprop="name">${productName}</h3>
        <hr class="card-divider">
        <p class="card-footer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span itemprop="price" content="USD">$${productPrice}</span>
            <i class="fas fa-trash-can"></i> 
        </p>
    `;
    return product;
}

// Función para renderizar los productos de acuerdo a la página
async function renderProducts(page = 1) {
    const data = await conexionDB.listProducts(page, itemsPerPage); // Obtenemos los productos para la página solicitada

    ulList.innerHTML = ""; // Limpiar la lista antes de renderizar

    data.products.forEach(productItem => ulList.appendChild(createProductCard(
        productItem.productName, 
        productItem.productPrice, 
        productItem.productUrl
    )));

    // Llamar a la función de paginación
    createPagination(data.totalItems, itemsPerPage, page, (newPage) => {
        currentPage = newPage;
        renderProducts(currentPage); // Actualizar la lista de productos con la nueva página
    });
}

// Llamar a la función para renderizar los productos en la primera página
renderProducts(currentPage);
