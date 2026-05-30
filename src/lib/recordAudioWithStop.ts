// تسجيل صوت المستخدم مع إمكانية الإيقاف اليدوي
// يُستخدم مع واجهة MediaRecorder

export function recordAudioWithStop(): { start: () => void, stop: () => Promise<Blob> } {
  let mediaRecorder: MediaRecorder | null = null;
  let stream: MediaStream | null = null;
  let chunks: BlobPart[] = [];
  let resolveStop: ((blob: Blob) => void) | null = null;

  const start = async () => {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
    chunks = [];
    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      if (resolveStop) resolveStop(blob);
      if (stream) stream.getTracks().forEach((track) => track.stop());
    };
    mediaRecorder.start();
  };

  const stop = () => {
    return new Promise<Blob>((resolve) => {
      resolveStop = resolve;
      if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
      }
    });
  };

  return { start, stop };
}
