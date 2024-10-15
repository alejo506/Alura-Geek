import { conexionDB } from './conexionDB.js';  // Importa el módulo que contiene funciones para la conexión a la base de datos
import { renderProducts } from './getProducts.js'; // Importa la función encargada de renderizar los productos en la interfaz
import { speechMessage } from './funcionalities/speech.js'; // Importa la función para emitir mensajes de voz
import { playSound } from './funcionalities/soundButtons.js'; // Importa la función para reproducir sonidos de los botones

/**
 * Maneja el clic del botón de eliminación de un producto.
 * @param {string} productId - ID del producto a eliminar.
 */
export async function handleDeleteButtonClick(productId) {
    try {
        // Muestra una ventana de confirmación usando SweetAlert2
        const confirmDelete = await Swal.fire({
            title: '¿Estás seguro?', // Título del cuadro de diálogo
            text: "¡No podrás revertir esta acción!", // Mensaje de advertencia
            icon: 'warning', // Icono que representa la advertencia
            showCancelButton: true, // Muestra el botón de cancelar
            confirmButtonColor: '#3085d6', // Color del botón de confirmación
            cancelButtonColor: '#d33', // Color del botón de cancelación
            confirmButtonText: 'Sí, eliminar', // Texto del botón de confirmación
            cancelButtonText: 'Cancelar' // Texto del botón de cancelación
        });

        // Si el usuario cancela la acción, se sale de la función
        if (!confirmDelete.isConfirmed) {
            return; // No realizar ninguna acción
        }

        // Intenta eliminar el producto de la base de datos
        const wasDeleted = await conexionDB.deleteProduct(productId);

        // Reproduce un sonido al eliminar el producto
        playSound('eliminate');

        // Verifica si la eliminación fue exitosa
        if (wasDeleted) {
            renderProducts(); // Actualiza la lista de productos en la interfaz

            // Muestra un mensaje de éxito al usuario
            await Swal.fire(
                '¡Eliminado!', // Título del mensaje de éxito
                'El producto ha sido eliminado con éxito.', // Mensaje informativo
                'success' // Tipo de mensaje (éxito)
            );

            // Mensaje de voz que se emitirá al usuario
            const mjsSpeech = "Producto eliminado de la base de datos";
            speechMessage(mjsSpeech); // Llama a la función para emitir el mensaje de voz

        } else {
            // Muestra un mensaje de error si la eliminación falló
            await Swal.fire(
                'Error', // Título del mensaje de error
                'Hubo un problema al intentar eliminar el producto.', // Mensaje de error
                'error' // Tipo de mensaje (error)
            );
        }
    } catch (error) {
        // Manejo de errores en caso de que algo falle durante el proceso
        await Swal.fire(
            'Error', // Título del mensaje de error
            'Ocurrió un error al intentar eliminar el producto.', // Mensaje informativo
            'error' // Tipo de mensaje (error)
        );
        console.error("Ocurrió un error al intentar eliminar el producto:", error); // Registra el error en la consola
    }
}
