
// ! 1. GET PRODUCTS
async function listProducts(offset = 1, limit = 6) {
    const response = await fetch(`http://localhost:3001/products?_page=${offset}&_limit=${limit}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    const data = await response.json();

    // Obtener el total de productos desde los headers de la respuesta
    const totalItems = response.headers.get('x-total-count');
    
    return {
        products: data,
        totalItems: totalItems ? parseInt(totalItems) : 0
    };
}




// ! 2. POST PRODUCTS

async function sendProducts(productName, productPrice, productUrl) {
    
    const conexion = await fetch("http://localhost:3001/products", {
        method:"POST",
        headers:{
            "Content-type":"application/json"
        },

        // Contenido que enviamos a la base de datos
        body: JSON.stringify({
            productName: productName,
            productPrice: productPrice,
            productUrl: productUrl
        })});


        if(!conexion.ok){
            throw new Error(`An error occurred while submitting the product: ${conexion.status}`);
        }

        const conexionConvertida = await conexion.json();
        
        return conexionConvertida;
}


// ! 3. FILTER PRODUCTS BY NAME

async function filterProducts(keyWord) {
    // Cambia a productName_like para hacer una búsqueda parcial
    const conexion = await fetch(`http://localhost:3001/products?q=${keyWord}`);
    const conexionConvertida = await conexion.json();
    return conexionConvertida;
}


// Función para eliminar un producto
// Función para eliminar un producto
export async function deleteProduct(productId) {
    const response = await fetch(`http://localhost:3001/products/${productId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });

    if (response.ok) {
        console.log("Producto eliminado con éxito");
        return true;  // Devuelve `true` si el producto fue eliminado exitosamente
    } else {
        console.error("Error al eliminar el producto");
        return false; // Devuelve `false` si hubo un error
    }
}




// ! EXPORTS FUNCTIONS
export const conexionDB = {
    listProducts,
    sendProducts,
    filterProducts,
    deleteProduct
}  