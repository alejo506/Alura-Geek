/**
 * Importa las funciones y conexiones necesarias de otros módulos.
 */
import { conexionDB } from "./conexionDB.js";
import { validateForm, validateName, validatePrice, validateUrl, cleanForm } from "./validate.js";
import { getCurrentPage, renderProducts } from "./getProducts.js";
import { speechMessage } from "./funcionalities/speech.js";
import { playSound } from "./funcionalities/soundButtons.js";

/** 
 * @type {HTMLFormElement} Selecciona el formulario del producto 
 */
const formProduct = document.querySelector("[data-form]");

/** 
 * @type {HTMLButtonElement} Selecciona el botón de envío 
 */
const submitBtn = document.querySelector(".bttn_send");

/** 
 * @type {HTMLInputElement} Selecciona el campo de nombre del producto 
 */
const inputProductName = document.querySelector("[data-prodName]");

/** 
 * @type {HTMLInputElement} Selecciona el campo de precio del producto 
 */
const inputProductPrice = document.querySelector("[data-prodPrice]");

/** 
 * @type {HTMLInputElement} Selecciona el campo de URL del producto 
 */
const inputProductUrl = document.querySelector("[data-prodUrl]");

// Inicialmente deshabilitar el botón
submitBtn.classList.add('disabled'); 

// Inicialmente deshabilitar el autocompletado en el formulario
formProduct.setAttribute('autocomplete', 'off');

/**
 * Función para enviar el producto a la base de datos.
 * @param {Event} e - Evento que previene el comportamiento predeterminado del formulario.
 * @returns {Promise<void>} No retorna valor, es asíncrono.
 */
async function sendProduct(e) {
    e.preventDefault(); // Prevenir el envío del formulario

    // Realiza la validación
    if (!validateForm()) {
        return; // Detiene la función si hay errores de validación
    }

    // Captura los valores del formulario
    const nameValue = inputProductName.value.trim();
    const priceValue = Number(inputProductPrice.value.trim());
    const urlValue = inputProductUrl.value.trim();

    try {
        // Enviar el producto a la base de datos
        await conexionDB.sendProducts(nameValue, priceValue, urlValue);

        // Reproduce un sonido indicando éxito
        playSound('send_message'); 
        
        // Mostrar alerta de éxito si se envió correctamente
        Swal.fire({
            title: '¡Éxito!',
            text: 'El producto se ha añadido correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            timer: 1000,
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
        { value: inputProductName.value, validate: validateName, errorId: 'nameError' },
        { value: inputProductPrice.value, validate: (v) => validatePrice(Number(v)), errorId: 'priceError' },
        { value: inputProductUrl.value, validate: validateUrl, errorId: 'urlError' }
    ];

    fields.forEach(({ value, validate, errorId }) => {
        document.getElementById(errorId).classList[
            value === "" || validate(value) ? 'remove' : 'add'
        ]('show'); // Agregar o remover la clase 'show' para mostrar u ocultar el error
    });
}

// Escucha el evento submit del formulario
formProduct.addEventListener("submit", (e) => {
    // Enviar los datos a la BD
    sendProduct(e);

    // Hacer scroll
    setTimeout(() => {
        document.querySelector(".product-list")?.scrollIntoView({ behavior: 'smooth' });
    }, 2000);
});

/** 
 * @type {HTMLElement} Icono asociado al nombre del producto 
 */
const iconName = document.querySelector('#productName-icon');

/** 
 * @type {HTMLElement} Icono asociado al precio del producto 
 */
const iconPrice = document.querySelector('#productPrice-icon');

/** 
 * @type {HTMLElement} Icono asociado a la URL del producto 
 */
const iconUrl = document.querySelector('#productUrl-icon');

/**
 * Función genérica para validar los campos del formulario en tiempo real.
 * @param {HTMLInputElement} selector - Selector del campo a validar.
 * @param {Function} validateFunction - Función de validación que se aplicará al campo.
 * @param {HTMLElement} icon - Icono asociado al campo para aplicar animaciones.
 * @returns {void}
 */
const handleInput = (selector, validateFunction, icon) => {
    selector.addEventListener("input", (e) => {
        validateFunction(e.target.value); // Llama a la función de validación correspondiente
        updateErrorMessages(); // Actualiza los mensajes de error
        toggleSubmitButton(); // Verifica el estado del botón
    });

    selector.addEventListener("focus", () => {
        icon.setAttribute('trigger', 'loop');
    });

    selector.addEventListener("blur", () => {
        icon.setAttribute('trigger', 'hover');
    });
};

// Agregar validaciones en tiempo real para los campos
handleInput(inputProductName, validateName, iconName);
handleInput(inputProductPrice, (value) => validatePrice(Number(value)), iconPrice);
handleInput(inputProductUrl, validateUrl, iconUrl);

// Evento para el botón de limpiar el formulario
document.querySelector(".bttn_clean").addEventListener("click", (event) => {
    event.preventDefault(); // Prevenir el comportamiento por defecto del botón
    cleanForm(); // Limpiar el formulario
    submitBtn.classList.add('disabled'); 
    submitBtn.setAttribute('disabled', true);
    playSound('clean'); // Reproducir sonido de limpieza
});
