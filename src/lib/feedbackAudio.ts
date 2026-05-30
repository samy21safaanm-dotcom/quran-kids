// ملف بسيط لتشغيل صوت تشجيعي
export function playSuccessSound() {
  const audio = new Audio('/audios/clap.mp3');
  audio.play();
}
