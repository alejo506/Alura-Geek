/**
 * Función para validar el nombre del producto.
 * @param {string} name - Nombre del producto a validar.
 * @returns {boolean} - Retorna true si el nombre es válido, false de lo contrario.
 */
export function validateName(name) {
    const nameRegex = /^[a-zA-Z0-9\- ']{3,13}$/; // Regex para validar el nombre
    const errorMessage = document.getElementById('nameError');

    // Verifica si el nombre es válido
    if (!nameRegex.test(name)) {
        errorMessage.classList.add('bold'); // Añadir negrita si hay error
        return false; // Hay un error
    }

    errorMessage.classList.remove('bold'); // Remover negrita si es válido
    return true; // Sin errores
}

/**
 * Función para validar el precio del producto.
 * @param {number} price - Precio del producto a validar.
 * @returns {boolean} - Retorna true si el precio es válido, false de lo contrario.
 */
export function validatePrice(price) {
    const errorMessage = document.getElementById('priceError');

    // Verifica si el precio es un número entero positivo
    if (!Number.isInteger(price) || price < 0 || price === "") {
        errorMessage.classList.add('bold'); // Añadir negrita si hay error
        return false; // Hay un error
    }

    errorMessage.classList.remove('bold'); // Remover negrita si es válido
    return true; // Sin errores
}

/**
 * Función para validar la URL del producto.
 * @param {string} url - URL del producto a validar.
 * @returns {boolean} - Retorna true si la URL es válida, false de lo contrario.
 */
export function validateUrl(url) {
    const errorMessage = document.getElementById('urlError');

    // Verifica si la URL es válida
    try {
        new URL(url);
    } catch (_) {
        errorMessage.classList.add('bold'); // Añadir negrita si hay error
        return false; // Hay un error
    }

    errorMessage.classList.remove('bold'); // Remover negrita si es válido
    return true; // Sin errores
}

/**
 * Función para validar el formulario completo del producto.
 * @returns {boolean} - Retorna true si todos los campos son válidos, false de lo contrario.
 */
export function validateForm() {
    // Obtener valores de los campos del formulario
    const productName = document.querySelector("[data-prodName]").value;
    const productPrice = Number(document.querySelector("[data-prodPrice]").value);
    const productUrl = document.querySelector("[data-prodUrl]").value;

    // Validar cada campo
    const isNameValid = validateName(productName);
    const isPriceValid = validatePrice(productPrice);
    const isUrlValid = validateUrl(productUrl);

    // Retorna true si no hay errores, false si hay errores
    return isNameValid && isPriceValid && isUrlValid; 
}

/**
 * Función para limpiar los campos del formulario.
 */
export function cleanForm() {
    document.querySelector("[data-prodName]").value = ''; // Limpiar el nombre del producto
    document.querySelector("[data-prodPrice]").value = ''; // Limpiar el precio del producto
    document.querySelector("[data-prodUrl]").value = ''; // Limpiar la URL del producto
}
