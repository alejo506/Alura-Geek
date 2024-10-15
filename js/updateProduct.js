import { conexionDB } from "./conexionDB.js"; // Asegúrate de que la ruta sea correcta
import { playSound } from "./funcionalities/soundButtons.js";
import { speechMessage } from "./funcionalities/speech.js";
import { getCurrentPage, renderProducts } from "./getProducts.js";
import { cleanForm } from "./validate.js";

// Obtener el modal y los botones de cierre
const modal = document.querySelector('.modal-container');
const closeModalBtn = document.querySelector('.modal-close-btn');

// Formulario dentro del modal para actualizar el producto
const productFormUpdate = document.getElementById('productFormUpdate');

// Variable para verificar si se han hecho cambios en el formulario
let isFormChanged = false;

// Función para manejar la carga de datos del producto en el modal
export async function loadProductData(productId) {
    try {
        // Abrir el modal
        modal.style.display = 'block';
        isFormChanged = false; // Resetea el estado de cambios al abrir el modal

        // Limpiar el formulario al abrir el modal
        cleanForm();

        // Obtener los datos del producto por su ID
        const productData = await conexionDB.getProductById(productId);

        // Verificar si se encontraron los datos del producto
        if (productData) {
            // Cargar los datos en los campos del modal
            document.getElementById("productNameUpdate").value = productData.productName || '';
            document.getElementById("productPriceUpdate").value = productData.productPrice || '';
            document.getElementById("productUrlUpdate").value = productData.productUrl || '';

            // Agregar evento de cambio en los campos para detectar cambios
            document.querySelectorAll('.modal-input').forEach(input => {
                input.addEventListener('input', () => {
                    isFormChanged = true; // Se ha hecho un cambio en el formulario
                });
            });

            // Agregar evento de submit para actualizar el producto
            productFormUpdate.onsubmit = async (event) => {
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

                    // Audio
                    playSound('send_message')

                    // Recargar los productos en la página actual
                    const currentPage = getCurrentPage();
                    renderProducts(currentPage);

                    // Limpiar el formulario y cerrar el modal
                    modal.style.display = 'none';

                    speechMessage("El producto ha sido actualizado")
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
            };
        } else {
            console.error("No se encontraron datos para el producto con ID:", productId);
        }

        // Manejar el cierre del modal
        closeModalBtn.onclick = () => {
            handleCloseModal();
        };

        // Cerrar el modal si se hace clic fuera del contenido del modal
        window.onclick = (e) => {
            if (e.target === modal) {
                handleCloseModal();
            }
        };
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

// Función para manejar el cierre del modal
function handleCloseModal() {
    if (!isFormChanged || confirm('¿Estás seguro de que deseas cerrar sin guardar los cambios?')) {
        modal.style.display = 'none';
        cleanForm(); // Limpiar el formulario al cerrar
        isFormChanged = false; // Resetear el estado del formulario
    }
}
