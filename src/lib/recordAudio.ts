// تسجيل صوت المستخدم وحفظه كملف webm
// يُستخدم مع واجهة MediaRecorder

export async function recordAudio(): Promise<Blob> {
  return new Promise(async (resolve, reject) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        resolve(blob);
      };
      mediaRecorder.start();
      // أوقف التسجيل بعد 15 ثانية تلقائياً
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach((track) => track.stop());
      }, 15000);
    } catch (err) {
      reject(err);
    }
  });
}
