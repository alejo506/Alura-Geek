import { conexionDB } from "./conexionDB.js"; // Importa el módulo para la conexión a la base de datos
import { createPagination } from "./pagination.js"; // Importa la función que maneja la paginación
import { handleDeleteButtonClick } from "./deleteProducts.js"; // Importa la función para manejar la eliminación de productos
import { loadProductData } from "./updateProduct.js"; // Importa la función para cargar los datos de un producto

const ulList = document.querySelector("[data-list]"); // Selecciona el contenedor de la lista de productos
const itemsPerPage = 6; // Número de productos que se mostrarán por página
let currentPage = 1; // Página actual que se está mostrando
const itemsQuantity = document.querySelector("[data-itemsQuantity]"); // Selecciona el elemento que muestra la cantidad total de productos

/**
 * Función para crear una tarjeta de producto.
 * @param {string} productName - Nombre del producto.
 * @param {number} productPrice - Precio del producto.
 * @param {string} productUrl - URL de la imagen del producto.
 * @param {string} productId - ID del producto.
 * @returns {HTMLElement} - Elemento de lista (li) que representa el producto.
 */
export default function createProductCard(productName, productPrice, productUrl, productId) {
    const product = document.createElement('li'); // Crea un nuevo elemento de lista
    product.className = "product-list__item"; // Asigna una clase al elemento de lista

    // Añade el contenido HTML a la tarjeta del producto
    product.innerHTML = `
        <img src="${productUrl}" alt="Product 1 - Description of product" class="product-list__image" itemprop="image">
        <section class="card-footer-section">
            <h3 class="product-list__name" itemprop="name">${productName}</h3>
            <hr class="card-divider">
            <section class="card-footer" itemprop="offers" itemscope itemtype="http://schema.org/Offer">
                <span itemprop="price" content="USD">$${productPrice}</span>
                <section>
                    <button type="button" class="update-button" data-id="${productId}" aria-label="Update"> <!-- Botón de actualizar -->
                        <lord-icon
                            src="https://cdn.lordicon.com/exymduqj.json"
                            trigger="hover"
                            stroke="bold"
                            colors="primary:#242424"
                            style="width:25px;height:25px">
                        </lord-icon>
                    </button>
                    <button type="button" class="delete-button" data-id="${productId}" aria-label="Delete"> <!-- Botón de eliminar -->
                        <lord-icon
                            src="https://cdn.lordicon.com/vlnvqvew.json"
                            trigger="hover"
                            stroke="bold"
                            colors="primary:#848484"
                            style="width:25px;height:25px">
                        </lord-icon>
                    </button>
                </section>
            </section>
        </section>
    `;

    return product; // Devuelve el elemento de lista creado
}

/**
 * Función para renderizar los productos de acuerdo a la página actual.
 * @param {number} visiblePage - Página a mostrar (por defecto es 1).
 */
export async function renderProducts(visiblePage = 1) {
    // Obtiene los productos para la página solicitada desde la base de datos
    const data = await conexionDB.listProducts(visiblePage, itemsPerPage);

    ulList.innerHTML = ""; // Limpia la lista antes de renderizar nuevos productos

    // Renderiza cada producto en la lista
    data.products.forEach(productItem => {
        const productCard = createProductCard(
            productItem.productName,
            productItem.productPrice,
            productItem.productUrl,
            productItem.id // Asegúrate de pasar el ID del producto
        );

        ulList.appendChild(productCard); // Añade la tarjeta del producto a la lista
    });

    // Crea la paginación fuera del bucle para evitar crearla múltiples veces
    createPagination(data.totalItems, itemsPerPage, visiblePage, (newPage) => {
        currentPage = newPage; // Actualiza la página actual
        renderProducts(currentPage); // Renderiza los productos de la nueva página
    });

    // Actualiza la cantidad total de productos en stock
    const totalItemsQuantity = data.totalItems;
    itemsQuantity.innerHTML = `<h3 class="stockQuantity" data-itemsQuantity>En stock: <span>${totalItemsQuantity}</span></h3>`;
}

// Delegación de eventos en el contenedor principal (ulList)
ulList.addEventListener('click', async (event) => {
    event.preventDefault(); // Evita el comportamiento por defecto del evento

    // Manejar el evento de eliminación
    if (event.target.closest('.delete-button')) {
        const deleteButton = event.target.closest('.delete-button'); // Encuentra el botón de eliminar
        const productId = deleteButton.dataset.id; // Obtiene el ID del producto

        // Llama a la función de eliminación y espera el resultado
        const isDeleted = await handleDeleteButtonClick(productId);
        
        if (isDeleted) {
            deleteButton.closest('li').remove(); // Elimina la tarjeta del DOM si fue confirmada la eliminación
        }
    }

    // Manejar el evento de actualización
    if (event.target.closest('.update-button')) {
        const updateButton = event.target.closest('.update-button'); // Encuentra el botón de actualizar
        const productId = updateButton.dataset.id; // Obtiene el ID del producto

        await loadProductData(productId); // Carga los datos del producto para actualizar
    }
});

/**
 * Función para obtener el valor actual de currentPage.
 * @returns {number} - La página actual.
 */
export function getCurrentPage() {
    return currentPage; // Devuelve la página actual
}

// Llama a la función para renderizar los productos en la primera página
renderProducts(currentPage);
