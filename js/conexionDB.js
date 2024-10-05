
// ! 1. GET PRODUCTS
async function listProducts() {
    const conexion = await fetch("http://localhost:3001/products", {
        method:"GET",
        headers:{
        "Content-type":"application/json"
        }
    });
    const conexionConvertida = await conexion.json(); // Obtiene la respuesta de la petición HTTP en formato JSON y la asigna a la variable products
    return conexionConvertida;
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


// ! FILTER PRODUCTS BY NAME

async function filterProducts(keyWord) {
    // Cambia a productName_like para hacer una búsqueda parcial
    const conexion = await fetch(`http://localhost:3001/products?q=${keyWord}`);
    const conexionConvertida = await conexion.json();
    return conexionConvertida;
}


// ! EXPORTS FUNCTIONS
export const conexionDB = {
    listProducts,
    sendProducts,
    filterProducts
}