import { conexionDB } from "./conexionDB.js";
import { validateForm, validateName, validatePrice, validateUrl, cleanForm } from "./validate.js";
import { getCurrentPage, renderProducts } from "./getProducts.js";
import { speechMessage } from "./funcionalities/speech.js";
import { playSound } from "./funcionalities/soundButtons.js";


const formProduct = document.querySelector("[data-form]");
const submitBtn = document.querySelector(".bttn_send"); // Selecciona el botón de envío

// Inicialmente deshabilitar el botón
submitBtn.classList.add('disabled'); 

// Función para enviar el producto
async function sendProduct(e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Realiza la validación
    if (!validateForm()) {
        return; // Detiene la función si hay errores de validación
    }

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
            timer: 2000, // Duración en milisegundos (3 segundos)
            timerProgressBar: true
        });

        // Audio
        playSound('send_message')

        // Pagina actual
        const page = getCurrentPage();


        renderProducts(page);

        // Speech System message
        const mjsSpeech = "Producto registrado en la base de datos";
        speechMessage(mjsSpeech);

        // Limpiar el formulario después de enviar
        formProduct.reset();

        // Limpia los mensajes de error después de un envío exitoso
        clearErrors();

        // Deshabilitar el botón después de un envío exitoso
        toggleSubmitButton();

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

// Función para limpiar los errores
function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.classList.remove('error'); // Remover la clase de negrita
    });
}

// Función para verificar y actualizar el estado del botón de envío
function toggleSubmitButton() {
    if (validateForm()) {
        submitBtn.classList.remove('disabled'); // Remover la clase deshabilitada
        submitBtn.style.pointerEvents = 'auto'; // Habilitar eventos del puntero
    } else {
        submitBtn.classList.add('disabled'); // Agregar la clase deshabilitada
        submitBtn.style.pointerEvents = 'none'; // Deshabilitar eventos del puntero
    }
}

// Función para actualizar el estado de los mensajes de error

function updateErrorMessages() {
    const productName = document.querySelector("[data-prodName]").value;
    const productPrice = document.querySelector("[data-prodPrice]").value;
    const productUrl = document.querySelector("[data-prodUrl]").value;

    // Validar el nombre del producto
    // Validar el nombre del producto
document.getElementById('nameError').classList[
    productName === "" || validateName(productName) ? 'remove' : 'add'
]('show');

// Validar el precio del producto
document.getElementById('priceError').classList[
    productPrice === "" || validatePrice(Number(productPrice)) ? 'remove' : 'add'
]('show');

// Validar la URL del producto
document.getElementById('urlError').classList[
    productUrl === "" || validateUrl(productUrl) ? 'remove' : 'add'
]('show');

}




// Escucha el evento submit del formulario
formProduct.addEventListener("submit", e => sendProduct(e));

// Agregar validaciones en tiempo real
document.querySelector("[data-prodName]").addEventListener("input", (e) => {
    validateName(e.target.value); // Valida el nombre al escribir
    updateErrorMessages(); // Actualiza los mensajes de error
    toggleSubmitButton(); // Verifica el estado del botón
});

document.querySelector("[data-prodPrice]").addEventListener("input", (e) => {
    validatePrice(Number(e.target.value)); 
    updateErrorMessages(); 
    toggleSubmitButton(); 
});

document.querySelector("[data-prodUrl]").addEventListener("input", (e) => {
    validateUrl(e.target.value); 
    updateErrorMessages(); 
    toggleSubmitButton(); 
});

// Evento para el botón de limpiar
document.querySelector(".bttn_clean").addEventListener("click", (event) => {
    event.preventDefault(); 
    cleanForm(); // Llama a la función para limpiar el formulario
    playSound('clean'); // Reproduce sonido
});


