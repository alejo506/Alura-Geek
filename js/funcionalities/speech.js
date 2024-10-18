// Obtiene el elemento del checkbox que controla la mutación del audio
const checkboxInput = document.getElementById('checkboxInput');

// Obtiene el elemento que representa el altavoz normal
const speaker = document.querySelector('.speaker');

// Obtiene el elemento que representa el altavoz silenciado
const muteSpeaker = document.querySelector('.mute-speaker');

// Inicialmente mostrar el altavoz y ocultar el altavoz silenciado
speaker.style.display = 'block';
muteSpeaker.style.display = 'block'; // Asegurarse de que el altavoz silenciado esté oculto al inicio

/**
 * Función para reproducir un mensaje de voz utilizando la síntesis de voz.
 * Escucha el estado del checkbox para habilitar o deshabilitar la reproducción de voz.
 *
 * @param {string} message - El texto que se desea convertir en voz.
 *
 * La función alterna la visibilidad de los altavoces según el estado del checkbox.
 * Si el checkbox está activado, se oculta el altavoz normal y se muestra el altavoz silenciado.
 * Si está desactivado, se reproduce el mensaje de voz utilizando la síntesis de voz.
 */
export function speechMessage(message) {
    // Escuchar el cambio en el checkbox para alternar el estado del altavoz
    checkboxInput.addEventListener('change', () => {
        // console.log(checkboxInput.checked); 

        if (checkboxInput.checked) {
            
            muteSpeaker.style.display = 'block'; // Muestra el altavoz silenciado
            window.speechSynthesis.cancel(); // Detener cualquier síntesis en curso
        } else {
            // El checkbox está desactivado (no mute), mostrar el altavoz normal
            speaker.style.display = 'block'; // Muestra el altavoz normal
        }
    });

    // Solo reproducir el mensaje si el checkbox está desactivado
    if (!checkboxInput.checked) {
        // Crea un nuevo objeto de SpeechSynthesisUtterance para manejar la síntesis de voz
        const messageSpeech = new SpeechSynthesisUtterance();
        messageSpeech.text = message; // Establece el texto a convertir en voz
        messageSpeech.volume = 0.8; // Establece el volumen (0.0 a 1.0)
        messageSpeech.rate = 0.8; // Establece la velocidad del habla (0.1 a 10)
        messageSpeech.pitch = 1.2; // Establece el tono de voz (0 a 2)
        messageSpeech.lang = 'es-MX'; // Establece el idioma a español de México (puedes cambiarlo según lo desees)

        // Inicia la reproducción del mensaje de voz
        window.speechSynthesis.speak(messageSpeech);
    }
}
