
export function validateName(name) {
    const nameRegex = /^[a-z A-Z 0-9\- ']{3,13}$/; // Regex para validar el nombre
    const errorMessage = document.getElementById('nameError');

    // Verifica si el nombre es válido
    if (!nameRegex.test(name)) {

        errorMessage.classList.add('bold'); // Añadir negrita si hay error
        return false; // Hay un error
    }

    errorMessage.classList.remove('bold'); // Remover negrita si es válido
    return true; // Sin errores
}

export function validatePrice(price) {
    const errorMessage = document.getElementById('priceError');

    // Verifica si el precio es válido
    if (!Number.isInteger(price) || price < 0 || price == "") { // Asegúrate de que el precio sea un número entero positivo
        errorMessage.classList.add('bold'); // Añadir negrita si hay error
        return false; // Hay un error
    }

    errorMessage.classList.remove('bold'); // Remover negrita si es válido
    return true; // Sin errores
}

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



// Función para validar el formulario completo
export function validateForm() {

    const productName = document.querySelector("[data-prodName]").value;
    const productPrice = Number(document.querySelector("[data-prodPrice]").value);
    const productUrl = document.querySelector("[data-prodUrl]").value;

    const isNameValid = validateName(productName);
    const isPriceValid = validatePrice(productPrice);
    const isUrlValid = validateUrl(productUrl);

    return isNameValid && isPriceValid && isUrlValid; // Retorna true si no hay errores, false si hay errores
}

export function cleanForm() {

    document.querySelector("[data-prodName]").value = '';
    document.querySelector("[data-prodPrice]").value = ''; // Elimina el valor directamente
    document.querySelector("[data-prodUrl]").value = '';

}



