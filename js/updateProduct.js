import { conexionDB } from "./conexionDB.js"; // Asegúrate de que la ruta sea correcta
import { getCurrentPage, renderProducts } from "./getProducts.js";
import { cleanForm } from "./validate.js";

// Obtener el modal y los botones de cierre
const modal = document.querySelector('.modal-container');
const closeModalBtn = document.querySelector('.modal-close-btn');

// Formulario dentro del modal para actualizar el producto
const productFormUpdate = document.getElementById('productFormUpdate');

// Función para manejar la carga de datos del producto en el modal
export async function loadProductData(productId) {
    try {
        // Abrir el modal
        modal.style.display = 'block';

        // Cerrar el modal cuando se hace clic en la "X"
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Cerrar el modal si se hace clic fuera del contenido del modal
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Obtener los datos del producto por su ID
        const productData = await conexionDB.getProductById(productId);

        // Verificar si se encontraron los datos del producto
        if (productData) {
            // Cargar los datos en los campos del modal
            document.getElementById("productNameUpdate").value = productData.productName || '';
            document.getElementById("productPriceUpdate").value = productData.productPrice || '';
            document.getElementById("productUrlUpdate").value = productData.productUrl || '';

            // Agregar evento de submit para actualizar el producto
            productFormUpdate.addEventListener("submit", async (event) => {
                event.preventDefault();

                // Obtener los valores actualizados de los campos del modal
                const updatedName = document.getElementById("productNameUpdate").value;
                const updatedPrice = document.getElementById("productPriceUpdate").value;
                const updatedUrl = document.getElementById("productUrlUpdate").value;

                // Validación simple de los campos
                if (!updatedName || !updatedPrice || !updatedUrl) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'Todos los campos son obligatorios.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    return; // Detener la ejecución si la validación falla
                }

                try {
                    // Actualizar el producto en la base de datos
                    await conexionDB.updateProduct(productId, updatedName, updatedPrice, updatedUrl);

                    // Recargar los productos en la página actual
                    const currentPage = getCurrentPage();
                    renderProducts(currentPage);

                    // Limpiar el formulario y cerrar el modal
                    cleanForm();
                    modal.style.display = 'none';

                    // Notificación de éxito
                    await Swal.fire({
                        title: '¡Éxito!',
                        text: 'El producto se actualizó correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                } catch (error) {
                    console.error("Error al actualizar el producto:", error);

                    // Notificación de error
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'No se pudo actualizar el producto. Inténtalo de nuevo.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            });
        } else {
            console.error("No se encontraron datos para el producto con ID:", productId);
        }
    } catch (error) {
        console.error("Error al cargar el producto para actualizar:", error);
        await Swal.fire({
            title: '¡Error!',
            text: 'Error al cargar los datos del producto. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}
