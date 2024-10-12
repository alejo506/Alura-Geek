
// ! Configuración de la API
// const API_URL = "http://localhost:3001/"; // URL base para la API de productos

const API_URL = "https://67099631af1a3998baa1e796.mockapi.io/products_geek/";

async function getTotalProducts() {
    const response = await fetch(`${API_URL}products`);
    const data = await response.json();
    return data.length; // Devuelve el conteo total de productos
}


// ! 1. Obtener productos (GET)
// offset = 1
// limit = 6
async function listProducts(offset, limit) {
    // Envía una solicitud para obtener productos con paginación
    const response = await fetch(`${API_URL}products?page=${offset}&limit=${limit}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        }
    });

    // Convierte la respuesta en formato JSON
    const data = await response.json();

    // Obtiene el total de productos
    const totalItems = await getTotalProducts();
    console.log(totalItems)
    
 
    // Retorna los productos y el total de productos
    return {
        products: data, // Lista de productos
        totalItems: totalItems ? parseInt(totalItems) : 0 // Total de productos como número
    };
}



// ! 2. Enviar un nuevo producto (POST)
async function sendProducts(productName, productPrice, productUrl) {
    // Crea un nuevo producto en formato JSON
    const newProduct = {
        productName: productName,
        productPrice: productPrice,
        productUrl: productUrl
    };

    // Envía una solicitud para crear un nuevo producto
    const response = await fetch(`${API_URL}products`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        },
        body: JSON.stringify(newProduct) // Envía el producto en formato JSON
    });

    // Verifica si la solicitud fue exitosa
    if (!response.ok) {
        throw new Error(`Error al enviar el producto: ${response.status}`); // Lanza error si falla
    }

    // Convierte la respuesta a formato JSON
    return await response.json(); // Retorna el producto creado
}

// ! 3. Filtrar productos por nombre (GET)
async function filterProducts(keyWord) {
    // Envía una solicitud para buscar productos por nombre
    const response = await fetch(`${API_URL}products?productName=${keyWord}`);

    // Convierte la respuesta a formato JSON
    return await response.json(); // Retorna la lista de productos filtrados
}

// ! 4. Eliminar un producto (DELETE)
export async function deleteProduct(productId) {
    // Envía una solicitud para eliminar un producto por ID
    const response = await fetch(`${API_URL}products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json" // Tipo de contenido JSON
        }
    });

    // Verifica si la eliminación fue exitosa
    if (response.ok) {
        console.log("Producto eliminado con éxito"); // Mensaje de éxito
        return true; // Retorna true si fue exitoso
    } else {
        console.error("Error al eliminar el producto"); // Mensaje de error
        return false; // Retorna false si hubo un error
    }
}

// ! Exportar funciones para ser utilizadas en otras partes de la aplicación
export const conexionDB = {
    listProducts,   // Función para listar productos
    sendProducts,   // Función para enviar un nuevo producto
    filterProducts, // Función para filtrar productos por nombre
    deleteProduct   // Función para eliminar un producto
};
