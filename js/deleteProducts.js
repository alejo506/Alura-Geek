import { conexionDB } from './conexionDB.js';  // Importar el módulo de conexión a la base de datos
import { renderProducts } from './getProducts.js'; // Importar la función que renderiza los productos
import { speechMessage } from './funcionalities/speech.js';


export async function handleDeleteButtonClick(productId) {
    try {
        // Confirmar eliminación del producto con SweetAlert2
        const confirmDelete = await Swal.fire({
            title: '¿Estás seguro?',
            text: "¡No podrás revertir esta acción!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        });

        if (!confirmDelete.isConfirmed) {
            return; // Si el usuario cancela, no hacer nada
        }

        // Eliminar el producto desde la base de datos
        const wasDeleted = await conexionDB.deleteProduct(productId);

        // Verificar si la eliminación fue exitosa
        if (wasDeleted) {
            // Mostrar un mensaje de éxito con SweetAlert2
            // Aquí podrías renderizar los productos actualizados
            renderProducts(); // Actualizar la lista de productos
            await Swal.fire(
                '¡Eliminado!',
                'El producto ha sido eliminado con éxito.',
                'success'
            );

            const mjsSpeech = "Producto eliminado de la base de datos"; 
            speechMessage(mjsSpeech);
            
        } else {
            // Mostrar un mensaje de error si no se eliminó
            await Swal.fire(
                'Error',
                'Hubo un problema al intentar eliminar el producto.',
                'error'
            );
        }
    } catch (error) {
        // Manejo de errores en caso de que falle la operación
        await Swal.fire(
            'Error',
            'Ocurrió un error al intentar eliminar el producto.',
            'error'
        );
        console.error("Ocurrió un error al intentar eliminar el producto:", error);
    }
}
