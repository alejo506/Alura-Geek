import { conexionDB } from "./conexionDB.js";
import { createPagination } from "./pagination.js";
import { handleDeleteButtonClick } from "./deleteProducts.js"; // Importar la función

const ulList = document.querySelector("[data-list]");
const itemsPerPage = 6; // Número de productos por página
let currentPage = 1; // Página actual

// Función para crear una tarjeta de producto
export default function createProductCard(productName, productPrice, productUrl, productId) {
    const product = document.createElement('li');
    product.className = "product-list__item";

    product.innerHTML = `
        <img src="${productUrl}" alt="Product 1 - Description of product" class="product-list__image" itemprop="image">
        <section class="card-footer-section">
        <h3 class="product-list__name" itemprop="name">${productName}</h3>
        <hr class="card-divider">
        <p class="card-footer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
            <span itemprop="price" content="USD">$${productPrice}</span>
            <button type="button" class="delete-button" data-id="${productId}">
                <i class="fas fa-trash-can"></i>
            </button>
        </p>
        </section>
    `;

    return product;
}

// Función para renderizar los productos de acuerdo a la página
export async function renderProducts(visiblePage=1) {
    const data = await conexionDB.listProducts(visiblePage, itemsPerPage); // Obtenemos los productos para la página solicitada

    ulList.innerHTML = ""; // Limpiar la lista antes de renderizar

    // Renderizar cada producto
    data.products.forEach(productItem => {
        const productCard = createProductCard(
            productItem.productName, 
            productItem.productPrice, 
            productItem.productUrl,
            productItem.id // Asegúrate de pasar el ID del producto
        );

        // Añadir evento de clic al botón de eliminar para pasar el productId a la función de eliminar
        const deleteButton = productCard.querySelector(".delete-button");

        deleteButton.addEventListener("click", async (event) => {
            event.preventDefault();  // Prevenir la acción predeterminada

            // Llamar a la función de eliminación y verificar si se eliminó correctamente
            const wasDeleted = await handleDeleteButtonClick(productItem.id);
            if (wasDeleted) {
                // Eliminar la tarjeta del DOM si la eliminación fue exitosa
                productCard.remove();

            } else {
                console.error("Error al eliminar el producto.");
            }
        });

        ulList.appendChild(productCard); // Añadir la tarjeta del producto a la lista
    });

    // Mover la función de paginación fuera del bucle
    createPagination(data.totalItems, itemsPerPage, visiblePage, (newPage) => {
        currentPage = newPage;
        renderProducts(currentPage); // Actualizar la lista de productos con la nueva página
    });

}

// Función para obtener el valor actual de currentPage
export function getCurrentPage() {
    return currentPage;
}

// Llamar a la función para renderizar los productos en la primera página
renderProducts(currentPage);
