import { conexionDB } from "./conexionDB.js";

const formProduct = document.querySelector("[data-form]");

async function sendProduct(e) {
    e.preventDefault();

    const productName = document.querySelector("[data-prodName]").value;
    const productPrice = Number(document.querySelector("[data-prodPrice]").value);
    const productUrl = document.querySelector("[data-prodUrl]").value;



    try {
        // Enviar el producto a la base de datos
        await conexionDB.sendProducts(productName, productPrice, productUrl);
        
        // Mostrar alerta de éxito si se envió correctamente
        Swal.fire({
            title: '¡Éxito!',
            text: 'El producto se ha añadido correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 3000, // Duración en milisegundos (3 segundos)
            timerProgressBar: true
        });
        
        // Limpiar el formulario después de enviar
        formProduct.reset();

    } catch (error) {
        console.error(error);
        
        // Mostrar alerta de error si hubo un problema al enviar
        Swal.fire({
            title: 'Error!',
            text: 'Hubo un problema al añadir el producto.',
            icon: 'error',
            confirmButtonText: 'Aceptar'
        });
    }
}

formProduct.addEventListener("submit", e => sendProduct(e));
  