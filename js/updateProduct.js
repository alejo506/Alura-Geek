import { conexionDB } from "./conexionDB.js"; // Importar la conexión a la base de datos
import { playSound } from "./funcionalities/soundButtons.js"; // Importar función para reproducir sonidos
import { speechMessage } from "./funcionalities/speech.js"; // Importar función para mensajes de voz
import { getCurrentPage, renderProducts } from "./getProducts.js"; // Importar funciones para obtener y renderizar productos
import { cleanForm } from "./validate.js"; // Importar función para limpiar el formulario

// Obtener el modal y los botones de cierre
const modal = document.querySelector('.modal-container'); // Seleccionar el contenedor del modal
const closeModalBtn = document.querySelector('.modal-close-btn'); // Seleccionar el botón de cerrar modal

// Formulario dentro del modal para actualizar el producto
const productFormUpdate = document.getElementById('productFormUpdate'); // Seleccionar el formulario de actualización de producto

// Variable para verificar si se han hecho cambios en el formulario
let isFormChanged = false; // Inicializar el estado de cambios en el formulario

/**
 * Función para manejar la carga de datos del producto en el modal
 * @param {string} productId - ID del producto que se desea actualizar.
 */
export async function loadProductData(productId) {
    try {
        // Abrir el modal
        modal.style.display = 'block'; // Mostrar el modal
        isFormChanged = false; // Resetea el estado de cambios al abrir el modal

        // Limpiar el formulario al abrir el modal
        cleanForm(); // Llamar a la función para limpiar el formulario

        // Obtener los datos del producto por su ID
        const productData = await conexionDB.getProductById(productId); // Obtener datos del producto desde la base de datos

        // Verificar si se encontraron los datos del producto
        if (productData) {
            // Cargar los datos en los campos del modal
            document.getElementById("productNameUpdate").value = productData.productName || ''; // Cargar nombre del producto
            document.getElementById("productPriceUpdate").value = productData.productPrice || ''; // Cargar precio del producto
            document.getElementById("productUrlUpdate").value = productData.productUrl || ''; // Cargar URL del producto

            // Agregar evento de cambio en los campos para detectar cambios
            document.querySelectorAll('.modal-input').forEach(input => {
                input.addEventListener('input', () => {
                    isFormChanged = true; // Se ha hecho un cambio en el formulario
                });
            });

            // Agregar evento de submit para actualizar el producto
            productFormUpdate.onsubmit = async (event) => {
                event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

                // Obtener los valores actualizados de los campos del modal
                const updatedName = document.getElementById("productNameUpdate").value; // Obtener el nuevo nombre del producto
                const updatedPrice = document.getElementById("productPriceUpdate").value; // Obtener el nuevo precio del producto
                const updatedUrl = document.getElementById("productUrlUpdate").value; // Obtener la nueva URL del producto

                // Validación simple de los campos
                if (!updatedName || !updatedPrice || !updatedUrl) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'Todos los campos son obligatorios.', // Mensaje de error si faltan campos
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    return; // Detener la ejecución si la validación falla
                }

                try {
                    // Actualizar el producto en la base de datos
                    await conexionDB.updateProduct(productId, updatedName, updatedPrice, updatedUrl); // Llamar a la función para actualizar el producto

                    // Reproducir sonido de mensaje enviado
                    playSound('send_message'); // Reproducir sonido para indicar acción exitosa

                    // Recargar los productos en la página actual
                    const currentPage = getCurrentPage(); // Obtener la página actual
                    renderProducts(currentPage); // Renderizar los productos de la página actual

                    // Limpiar el formulario y cerrar el modal
                    modal.style.display = 'none'; // Cerrar el modal

                    // Mensaje de voz confirmando la actualización
                    speechMessage("El producto ha sido actualizado"); // Mensaje de voz para notificación

                    // Notificación de éxito
                    await Swal.fire({
                        title: '¡Éxito!',
                        text: 'El producto se actualizó correctamente.', // Mensaje de éxito
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });
                } catch (error) {
                    console.error("Error al actualizar el producto:", error); // Log de error en consola

                    // Notificación de error
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'No se pudo actualizar el producto. Inténtalo de nuevo.', // Mensaje de error
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                }
            };
        } else {
            console.error("No se encontraron datos para el producto con ID:", productId); // Log de error si no se encuentra el producto
        }

        // Manejar el cierre del modal
        closeModalBtn.onclick = () => {
            handleCloseModal(); // Llamar a la función para cerrar el modal
        };

        // Cerrar el modal si se hace clic fuera del contenido del modal
        window.onclick = (e) => {
            if (e.target === modal) {
                handleCloseModal(); // Llamar a la función para cerrar el modal
            }
        };
    } catch (error) {
        console.error("Error al cargar el producto para actualizar:", error); // Log de error si falla la carga
        await Swal.fire({
            title: '¡Error!',
            text: 'Error al cargar los datos del producto. Intenta nuevamente.', // Mensaje de error
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

/**
 * Función para manejar el cierre del modal
 */
function handleCloseModal() {
    // Confirmar si hay cambios sin guardar antes de cerrar
    if (!isFormChanged || confirm('¿Estás seguro de que deseas cerrar sin guardar los cambios?')) {
        modal.style.display = 'none'; // Cerrar el modal
        cleanForm(); // Limpiar el formulario al cerrar
        isFormChanged = false; // Resetear el estado del formulario
    }
}
