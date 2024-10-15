/**
 * Función para reproducir un sonido a partir de un archivo de audio.
 * @param {string} soundName - Nombre del archivo de sonido (sin extensión) que se desea reproducir.
 */
export function playSound(soundName) {
  // Crea un nuevo objeto de audio con la ruta del archivo correspondiente
  const audio = new Audio(`./sound/${soundName}.mp3`);

  audio.currentTime = 0; // Resetea el audio al inicio
  // Intenta reproducir el sonido y maneja cualquier error que pueda ocurrir
  audio.play().catch(error => console.error('Error playing sound:', error));
}
