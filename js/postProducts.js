import { conexionDB } from "./conexionDB.js";
import { validateForm, validateName, validatePrice, validateUrl, cleanForm } from "./validate.js";
import { getCurrentPage, renderProducts } from "./getProducts.js";
import { speechMessage } from "./funcionalities/speech.js";
import { playSound } from "./funcionalities/soundButtons.js";


const formProduct = document.querySelector("[data-form]");
const submitBtn = document.querySelector(".bttn_send"); // Selecciona el botón de envío

// Inicialmente deshabilitar el botón
submitBtn.classList.add('disabled'); 

/**
 * Función para enviar el producto a la base de datos.
 * @param {Event} e - Evento que previene el comportamiento predeterminado del formulario.
 * @returns {void}
 */
async function sendProduct(e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Realiza la validación
    if (!validateForm()) {
        return; // Detiene la función si hay errores de validación
    }

    // Captura los valores del formulario
    const productName = document.querySelector("[data-prodName]").value;
    const productPrice = Number(document.querySelector("[data-prodPrice]").value);
    const productUrl = document.querySelector("[data-prodUrl]").value;

    try {
        // Enviar el producto a la base de datos
        await conexionDB.sendProducts(productName, productPrice, productUrl);

        // Reproduce un sonido indicando éxito
        playSound('send_message'); 
        
        // Mostrar alerta de éxito si se envió correctamente
        Swal.fire({
            title: '¡Éxito!',
            text: 'El producto se ha añadido correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 2000, // Duración en milisegundos (2 segundos)
            timerProgressBar: true
        });

        // Obtener la página actual y volver a renderizar productos
        const page = getCurrentPage();
        renderProducts(page);

        // Mensaje de voz confirmando la acción
        const mjsSpeech = "Producto registrado en la base de datos";
        speechMessage(mjsSpeech);

        // Limpiar el formulario después de enviar
        formProduct.reset();

        // Limpiar los mensajes de error después del envío
        clearErrors();

        // Deshabilitar el botón después del envío
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

/**
 * Función para limpiar los mensajes de error del formulario.
 * Elimina la clase 'error' de todos los elementos con errores.
 * @returns {void}
 */
function clearErrors() {
    const errors = document.querySelectorAll('.error');
    errors.forEach(error => {
        error.classList.remove('error'); // Remover la clase de negrita
    });
}

/**
 * Función para habilitar o deshabilitar el botón de envío basado en la validación del formulario.
 * Cambia el estilo y los eventos del botón según su estado.
 * @returns {void}
 */
function toggleSubmitButton() {
    if (validateForm()) {
        submitBtn.classList.remove('disabled'); // Remover la clase deshabilitada
        submitBtn.style.pointerEvents = 'auto'; // Habilitar eventos del puntero
    } else {
        submitBtn.classList.add('disabled'); // Agregar la clase deshabilitada
        submitBtn.style.pointerEvents = 'none'; // Deshabilitar eventos del puntero
    }
}

/**
 * Función para actualizar los mensajes de error en los campos.
 * Recorre los campos del formulario y muestra/oculta los mensajes de error según la validación.
 * @returns {void}
 */
function updateErrorMessages() {
    const fields = [
        { value: document.querySelector("[data-prodName]").value, validate: validateName, errorId: 'nameError' },
        { value: document.querySelector("[data-prodPrice]").value, validate: (v) => validatePrice(Number(v)), errorId: 'priceError' },
        { value: document.querySelector("[data-prodUrl]").value, validate: validateUrl, errorId: 'urlError' }
    ];

    fields.forEach(({ value, validate, errorId }) => {
        document.getElementById(errorId).classList[
            value === "" || validate(value) ? 'remove' : 'add'
        ]('show'); // Agregar o remover la clase 'show' para mostrar u ocultar el error
    });
}

// Escucha el evento submit del formulario
formProduct.addEventListener("submit", sendProduct);

/**
 * Función genérica para validar los campos del formulario en tiempo real.
 * @param {string} selector - Selector del campo a validar.
 * @param {Function} validateFunction - Función de validación que se aplicará al campo.
 * @returns {void}
 */
const handleInput = (selector, validateFunction) => {
    document.querySelector(selector).addEventListener("input", (e) => {
        validateFunction(e.target.value); // Llama a la función de validación correspondiente
        updateErrorMessages(); // Actualiza los mensajes de error
        toggleSubmitButton(); // Verifica el estado del botón
    });
};

// Agregar validaciones en tiempo real para los campos
handleInput("[data-prodName]", validateName);
handleInput("[data-prodPrice]", (value) => validatePrice(Number(value)));
handleInput("[data-prodUrl]", validateUrl);

// Evento para el botón de limpiar el formulario
document.querySelector(".bttn_clean").addEventListener("click", (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del botón
    cleanForm(); // Limpiar el formulario
    playSound('clean'); // Reproducir sonido de limpieza
});
