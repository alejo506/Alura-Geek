import { conexionDB } from "./conexionDB.js";
import { createPagination } from "./pagination.js";
import { handleDeleteButtonClick } from "./deleteProducts.js"; // Importar la función
import { loadProductData } from "./updateProduct.js";






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

        const updateButtonCard = productCard.querySelector(".update-button");
        
        const updateButtonForm =  document.getElementById("updateBtn");
        updateButtonForm.classList.add('disabled');

        updateButtonCard.addEventListener("click", async  (event) => {
            event.preventDefault(); 
            await loadProductData(productItem.id, updateButtonForm);
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
