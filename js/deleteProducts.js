import { conexionDB } from './conexionDB.js';  // Importar el módulo de conexión a la base de datos
import { renderProducts } from './getProducts.js'; // Importar la función que renderiza los productos

// Función que maneja el evento de clic para eliminar productos
export async function handleDeleteButtonClick(productId) {

    // Agregar evento de clic a cada botón de eliminar
    
            // Eliminar el producto desde la base de datos
            const wasDeleted = await conexionDB.deleteProduct(productId); 
            
            if (wasDeleted) {
                renderProducts(currentPage); // Volver a renderizar los productos si la eliminación fue exitosa
            } else {
                console.error("Error al eliminar el producto");
            }
 
}