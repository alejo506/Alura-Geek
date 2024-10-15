import { conexionDB } from "./conexionDB.js";
import { createPagination } from "./pagination.js";
import { handleDeleteButtonClick } from "./deleteProducts.js";
import { loadProductData } from "./updateProduct.js";

const ulList = document.querySelector("[data-list]");
const itemsPerPage = 6; // Número de productos por página
let currentPage = 1; // Página actual
const itemsQuantity = document.querySelector("[data-itemsQuantity]"); // Número de productos

// Función para crear una tarjeta de producto
export default function createProductCard(productName, productPrice, productUrl, productId) {
    const product = document.createElement('li');
    product.className = "product-list__item";

    product.innerHTML = `
        <img src="${productUrl}" alt="Product 1 - Description of product" class="product-list__image" itemprop="image">
        <section class="card-footer-section">
            <h3 class="product-list__name" itemprop="name">${productName}</h3>
            <hr class="card-divider">
            <section class="card-footer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                <span itemprop="price" content="USD">$${productPrice}</span>
                    <section>
                        <button type="button" class="update-button" data-id="${productId}">
                            <lord-icon
                                src="https://cdn.lordicon.com/exymduqj.json"
                                trigger="hover"
                                stroke="bold"
                                colors="primary:#242424,secondary:#848484"
                                style="width:25px;height:25px">
                            </lord-icon>
                        </button>
                        <button type="button" class="delete-button" data-id="${productId}">
                            <lord-icon
                                src="https://cdn.lordicon.com/vlnvqvew.json"
                                trigger="hover"
                                stroke="bold"
                                colors="primary:#848484,secondary:#000000"
                                style="width:25px;height:25px">
                            </lord-icon>
                        </button>
                    </section>
            </section>
        </section>
    `;

    return product;
}

// Función para renderizar los productos de acuerdo a la página
export async function renderProducts(visiblePage = 1) {
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

        ulList.appendChild(productCard); // Añadir la tarjeta del producto a la lista
    });

    // Mover la función de paginación fuera del bucle
    createPagination(data.totalItems, itemsPerPage, visiblePage, (newPage) => {
        currentPage = newPage;
        renderProducts(currentPage); // Actualizar la lista de productos con la nueva página
    });

    // Productos en Stock
    const totalItemsQuantity = data.totalItems;

    itemsQuantity.innerHTML = `<h3 class="stockQuantity" data-itemsQuantity>En stock: <span>${totalItemsQuantity}</span></h3>`;
}

// Delegación de eventos en el contenedor principal (ulList)
ulList.addEventListener('click', async (event) => {
    event.preventDefault();

    // Manejar el evento de eliminar
    if (event.target.closest('.delete-button')) {
        const deleteButton = event.target.closest('.delete-button');
        const productId = deleteButton.dataset.id;

        // Llama a la función de eliminación y espera el resultado
        const isDeleted = await handleDeleteButtonClick(productId);
        
        if (isDeleted) {
            deleteButton.closest('li').remove(); // Eliminar la tarjeta del DOM si fue confirmada la eliminación
        }
    }

    // Manejar el evento de actualizar
    if (event.target.closest('.update-button')) {
        const updateButton = event.target.closest('.update-button');
        const productId = updateButton.dataset.id;

        await loadProductData(productId); // Cargar los datos del producto para actualizar
    }
});

// Función para obtener el valor actual de currentPage
export function getCurrentPage() {
    return currentPage;
}

// Llamar a la función para renderizar los productos en la primera página
renderProducts(currentPage);
