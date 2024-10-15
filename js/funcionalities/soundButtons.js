export function playSound(playSound){

  playSound = new Audio(`./sound/${playSound}.mp3`);

  playSound.currentTime = 0; // Resetea el audio
  playSound.play().catch(error => console.error('Error playing sound:', error));
}