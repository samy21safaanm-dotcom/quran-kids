"use client";
import React, { useState, useRef } from 'react';
import { recordAudioWithStop } from '../lib/recordAudioWithStop';
import { ChallengeData } from './types';

interface TaqeemHifzChallengeProps {
  ayahStart: string; // بداية الآية أو جزء منها
  ayahRest: string; // الجزء المطلوب من الطفل قوله
  audioUrl?: string; // مسار الصوت (اختياري)
  onSuccess: () => void;
  onFail: () => void;
}

const TaqeemHifzChallenge: React.FC<TaqeemHifzChallengeProps> = ({
  ayahStart,
  ayahRest,
  audioUrl,
  onSuccess,
  onFail,
}) => {
  const [recording, setRecording] = useState(false);
  const [userAudio, setUserAudio] = useState<string | null>(null);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const [error, setError] = useState<string | null>(null);
  // لا حاجة لـ recognitionRef مع Amazon Transcribe

  // تحقق ذكي: تحويل الصوت إلى نص ومقارنته بالنص الصحيح
  // لم يعد هذا مطلوبًا لأن التقييم يتم مباشرة من المايك

  // دالة حساب المسافة بين النصين (Levenshtein distance)
  function levenshtein(a: string, b: string) {
    const matrix = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
    for (let i = 1; i <= a.length; i++) {
      for (let j = 1; j <= b.length; j++) {
        matrix[i][j] = a[i - 1] === b[j - 1]
          ? matrix[i - 1][j - 1]
          : 1 + Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]);
      }
    }
    return matrix[a.length][b.length];
  }

  // تسجيل صوتي مع زر إيقاف
  const recorderRef = useRef<ReturnType<typeof recordAudioWithStop> | null>(null);
  const startRecording = async () => {
    setRecording(true);
    setResult(null);
    setError(null);
    setUserAudio(null);
    recorderRef.current = recordAudioWithStop();
    await recorderRef.current.start();
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    setRecording(false);
    try {
      const blob = await recorderRef.current.stop();
      setUserAudio(URL.createObjectURL(blob));
      // رفع الصوت وتحويله
      const formData = new FormData();
      formData.append('audio', blob, 'audio.webm');
      const res = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data.transcript) {
        let details = '';
        if (data?.error) details += data.error + '\n';
        if (data?.stack) details += data.stack;
        setError('خطأ من الخادم: ' + details || 'حدث خطأ أثناء تحويل الصوت إلى نص');
        setResult('fail');
        onFail();
        return;
      }
      // مقارنة النص
      const transcript = data.transcript.trim();
      const normalize = (txt: string) => txt.replace(/[ًٌٍَُِّْـ"'،.؟\-]/g, '').replace(/\s+/g, '').toLowerCase();
      const expected = normalize(ayahRest);
      const actual = normalize(transcript);
      const similarity = (a: string, b: string) => {
        const l = Math.max(a.length, b.length);
        return (l - levenshtein(a, b)) / l;
      };
      const sim = similarity(actual, expected);
      let isCorrect = sim > 0.85;
      setResult(isCorrect ? 'success' : 'fail');
      if (isCorrect) {
        setError(null);
        onSuccess();
      } else {
        if (actual.length < expected.length * 0.7) {
          setError('يبدو أنك لم تكمل السورة كاملة، حاول مرة أخرى!');
        } else {
          setError('هناك بعض الأخطاء في الحفظ أو النطق، حاول مرة أخرى!');
        }
        onFail();
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء التسجيل أو رفع الصوت');
      setResult('fail');
      onFail();
    }
  };

  return (
    <div className="flex flex-col items-center gap-3 sm:gap-4 rtl w-full px-2 sm:px-0">
      <div className="bg-white/80 rounded-xl p-3 sm:p-4 text-base sm:text-lg font-bold text-purple-900 shadow text-center w-full max-w-[min(100%,42rem)] leading-relaxed">
        <span>{ayahStart}</span>
        <span className="text-gray-400"> ... </span>
        <span className="text-gray-500">(أكمل الآية بصوتك)</span>
      </div>
      {audioUrl && (
        <audio src={audioUrl} controls className="mb-2 w-full max-w-[min(100%,26rem)]" />
      )}
      <div className="flex flex-col items-center gap-2 w-full">
        {!recording && (
          <button
            className="rounded-full px-5 sm:px-6 py-3 sm:py-4 text-white text-xl sm:text-2xl bg-purple-600 hover:bg-purple-700 shadow-lg mb-2 min-h-11"
            onClick={startRecording}
            aria-label="بدء التسجيل"
          >
            <span style={{ fontSize: 26 }}>🎙️</span>
          </button>
        )}
        {recording && (
          <button
            className="flex flex-col items-center justify-center rounded-full border-4 border-white px-5 sm:px-6 py-4 sm:py-5 text-white text-2xl sm:text-3xl bg-red-600 animate-pulse shadow-2xl mb-2 transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 min-h-11"
            style={{ minWidth: 88, minHeight: 88 }}
            onClick={stopRecording}
            aria-label="إيقاف التسجيل"
          >
            <span style={{ fontSize: 34 }}>⏹️</span>
            <span className="text-sm sm:text-base font-bold mt-1.5 sm:mt-2">إيقاف التسجيل</span>
          </button>
        )}
        <div className="text-purple-900 font-bold text-sm sm:text-base md:text-lg flex items-center justify-center gap-2 mb-2 text-center px-1">
          <span role="img" aria-label="ميكروفون">🎤</span>
          اضغط على الميكروفون وسجل تلاوتك للآية المطلوبة
        </div>
        {recording && <div className="text-purple-700 font-bold animate-pulse text-sm sm:text-base text-center">يتم الآن الاستماع... تحدث الآن!</div>}
      </div>
      {userAudio && (
        <audio src={userAudio} controls className="mt-2 w-full max-w-[min(100%,26rem)]" />
      )}
      {result === 'success' && (
        <div className="flex items-center justify-center gap-2 text-green-600 font-bold mt-2 animate-bounce text-sm sm:text-base text-center px-1">
          <span>✅</span> أحسنت! تلاوتك صحيحة
          <audio src="/audios/clap.mp3" autoPlay style={{display:'none'}} />
        </div>
      )}
      {result === 'fail' && (
        <div className="flex items-center justify-center gap-2 text-red-600 font-bold mt-2 text-sm sm:text-base text-center px-1">
          <span>❌</span> {error || 'حاول مرة أخرى، حفظك غير سليم أو به أخطاء'}
        </div>
      )}
    </div>
  );
};

export default TaqeemHifzChallenge;
