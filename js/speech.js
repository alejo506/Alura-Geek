
export function speechMessage(mjsSpeech){

    const messageSpeech = new SpeechSynthesisUtterance();
    messageSpeech.text = mjsSpeech;
    messageSpeech.volume = 0.8;
    messageSpeech.rate = 0.8;
    messageSpeech.pitch = 1.2;
    messageSpeech.lang = 'es-MX'; // Puedes cambiar el idioma según lo desees
    window.speechSynthesis.speak(messageSpeech);

}