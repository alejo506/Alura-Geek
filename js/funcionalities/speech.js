/**
 * Función para reproducir un mensaje de voz utilizando la síntesis de voz.
 * @param {string} message - El texto que se desea convertir a voz.
 */
export function speechMessage(message) {
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
