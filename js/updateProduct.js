import { conexionDB } from "./conexionDB.js"; // Asegúrate de que la ruta sea correcta
import { getCurrentPage, renderProducts } from "./getProducts.js";
import { cleanForm } from "./validate.js";

// Función para manejar la carga de datos del producto
export async function loadProductData(productId, updateButtonForm) {
    try {

        updateButtonForm.classList.remove('disabled');

        // Obtener el producto por su ID
        const productData = await conexionDB.getProductById(productId);

        // Verificar si se encontraron datos del producto
        if (productData) {
            document.querySelector("[data-prodName]").value = productData.productName || '';
            document.querySelector("[data-prodPrice]").value = productData.productPrice || '';
            document.querySelector("[data-prodUrl]").value = productData.productUrl || '';

            // Agregar evento para actualizar el producto cuando se haga clic en el botón de actualizar
            updateButtonForm.addEventListener("click", async (event) => {
                event.preventDefault();
                
                const updatedName = document.querySelector("[data-prodName]").value;
                const updatedPrice = document.querySelector("[data-prodPrice]").value;
                const updatedUrl = document.querySelector("[data-prodUrl]").value;

                // Validación simple de campos
                if (!updatedName || !updatedPrice || !updatedUrl) {
                    await Swal.fire({
                        title: '¡Error!',
                        text: 'Todos los campos son obligatorios.',
                        icon: 'error',
                        confirmButtonText: 'Aceptar'
                    });
                    return; // Detener la ejecución si hay un error de validación
                }

                try {
                    
                    const updatedProduct = await conexionDB.updateProduct(productId, updatedName, updatedPrice, updatedUrl);
                    
                    const currentPage = getCurrentPage();
                    renderProducts(currentPage);
                    cleanForm();
                    
                    // SweetAlert para notificar al usuario sobre la actualización
                    await Swal.fire({
                        title: '¡Éxito!',
                        text: 'El producto se actualizó correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    });

                    console.log("Producto actualizado:", updatedProduct);
                } catch (error) {
                    console.error("Error al actualizar el producto:", error);
                    // SweetAlert para mostrar el error al actualizar
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
            // Log the error but do not show SweetAlert for not found
        }

        console.log("Producto cargado en el formulario", productData);
        
    } catch (error) {
        console.error("Error al cargar el producto para actualizar:", error);
        // SweetAlert para mostrar el error de conexión o cualquier otro error
        await Swal.fire({
            title: '¡Error!',
            text: 'Error al cargar los datos del producto. Intenta nuevamente.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}
