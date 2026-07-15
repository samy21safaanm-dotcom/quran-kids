"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { recordAudioWithStop } from '../lib/recordAudioWithStop';

interface Props {
  ayat: string[];
  onSuccess?: () => void;
}

export default function RecordAndRateChallenge({ ayat, onSuccess }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [rating, setRating] = useState<'good' | 'improve' | null>(null);
  const [showRating, setShowRating] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [scores, setScores] = useState<('good' | 'improve')[]>([]);

  const recorderRef = useRef<ReturnType<typeof recordAudioWithStop> | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const startRecording = async () => {
    setRecordedUrl(null);
    setRating(null);
    setShowRating(false);
    setRecording(true);
    recorderRef.current = recordAudioWithStop();
    await recorderRef.current.start();
  };

  const stopRecording = async () => {
    if (!recorderRef.current) return;
    setRecording(false);
    try {
      const blob = await recorderRef.current.stop();
      const url = URL.createObjectURL(blob);
      setRecordedUrl(url);
    } catch (err) {
      console.error('Recording error:', err);
    }
  };

  const handleRating = (val: 'good' | 'improve') => {
    setRating(val);
    setScores([...scores, val]);
    setTimeout(() => {
      if (currentIdx + 1 >= ayat.length) {
        setCompleted(true);
        onSuccess?.();
      } else {
        setCurrentIdx(i => i + 1);
        setRecordedUrl(null);
        setRating(null);
        setShowRating(false);
      }
    }, 1300);
  };

  if (completed) {
    const goodCount = scores.filter(s => s === 'good').length;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-3 sm:gap-4 py-6 sm:py-8 px-2"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-5xl sm:text-6xl md:text-7xl"
        >
          🎙️
        </motion.span>
        <div className="text-xl sm:text-2xl font-black text-purple-900 text-center">ممتاز! اكتملت التسجيلات 🎉</div>
        <div className="text-base sm:text-lg text-purple-700 font-bold text-center">
          {goodCount} من {scores.length} بتقييم ممتاز
        </div>
        <div className="flex gap-1 mt-2">
          {scores.map((s, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`text-2xl sm:text-3xl ${s === 'good' ? 'text-yellow-400' : 'text-gray-400'}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>
        <audio src="/audios/clap.mp3" autoPlay style={{ display: 'none' }} />
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col gap-4 sm:gap-6 items-center px-2 sm:px-0">
      {/* شريط التقدم */}
      <div className="flex gap-2">
        {ayat.map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === currentIdx ? 1.4 : 1 }}
            className={`rounded-full transition-all ${
              i < currentIdx ? 'bg-green-400 w-4 h-4' :
              i === currentIdx ? 'bg-yellow-400 w-4 h-4' :
              'bg-white/30 w-3 h-3'
            }`}
          />
        ))}
      </div>

      {/* عرض الآية */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-4 sm:p-6 md:p-8 text-center border-2 border-yellow-300 shadow-xl"
        >
          <div className="text-sm text-purple-500 font-bold mb-4">
            الآية {currentIdx + 1} من {ayat.length}
          </div>
          <div
            className="text-xl sm:text-2xl md:text-4xl font-black text-purple-900 leading-relaxed"
            style={{ fontFamily: 'Tajawal, Arial' }}
          >
            {ayat[currentIdx]}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* منطقة التسجيل */}
      <div className="flex flex-col items-center gap-4 w-full">
        {!recordedUrl ? (
          <>
            {/* زر التسجيل */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={recording ? stopRecording : startRecording}
              className={`relative w-full sm:w-auto sm:min-w-[240px] px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 rounded-full font-black text-lg sm:text-xl md:text-2xl shadow-2xl border-4 transition-all min-h-11 ${
                recording
                  ? 'bg-red-500 text-white border-red-700 animate-pulse'
                  : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-700 hover:shadow-2xl'
              }`}
            >
              {recording ? (
                <span className="flex items-center gap-2">
                  🔴 توقف
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  🎤 ابدأ التسجيل
                </span>
              )}
            </motion.button>

            {/* نص مساعد */}
            <div className="text-sm text-purple-600 font-bold">
              {recording ? 'جاري التسجيل... اضغط التوقف عندما تنتهي' : 'اقرأ الآية بصوت واضح'}
            </div>
          </>
        ) : (
          <>
            {/* تشغيل التسجيل */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (audioRef.current) {
                  audioRef.current.play();
                  setIsPlaying(true);
                }
              }}
              disabled={isPlaying}
              className="w-full sm:w-auto sm:min-w-[220px] px-5 sm:px-8 py-3 sm:py-4 rounded-full font-black text-base sm:text-xl shadow-lg bg-gradient-to-r from-green-400 to-green-500 text-white border-2 border-green-600 hover:shadow-xl transition-all disabled:opacity-60 min-h-11"
            >
              {isPlaying ? '▶️ جاري التشغيل...' : '▶️ استمع للتسجيل'}
            </motion.button>
            <audio
              ref={audioRef}
              src={recordedUrl}
              onEnded={() => setIsPlaying(false)}
              style={{ display: 'none' }}
            />

            {/* خيارات التقييم */}
            {!showRating && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-purple-700 font-bold text-base sm:text-lg"
              >
                اسمع التسجيل وقيّم نفسك
              </motion.div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2 flex-wrap justify-center w-full">
              {/* زر صحيح */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { setShowRating(true); handleRating('good'); }}
                disabled={showRating}
                className={`w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-5 rounded-2xl font-black text-base sm:text-xl shadow-lg border-4 transition-all min-h-11 ${
                  rating === 'good'
                    ? 'bg-green-100 border-green-400 text-green-700 scale-110'
                    : showRating
                    ? 'opacity-40 border-gray-200'
                    : 'bg-white hover:bg-green-50 border-green-400 text-green-700'
                }`}
              >
                ✅ صحيح ممتاز
              </motion.button>

              {/* زر يحتاج تحسين */}
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => { setShowRating(true); handleRating('improve'); }}
                disabled={showRating}
                className={`w-full sm:w-auto px-5 sm:px-8 py-3 sm:py-5 rounded-2xl font-black text-base sm:text-xl shadow-lg border-4 transition-all min-h-11 ${
                  rating === 'improve'
                    ? 'bg-yellow-100 border-yellow-400 text-yellow-700 scale-110'
                    : showRating
                    ? 'opacity-40 border-gray-200'
                    : 'bg-white hover:bg-yellow-50 border-yellow-400 text-yellow-700'
                }`}
              >
                ⚠️ يحتاج تحسين
              </motion.button>
            </div>

            {/* ردود الفعل */}
            <AnimatePresence>
              {showRating && rating && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`text-center font-black text-base sm:text-lg ${
                    rating === 'good' ? 'text-green-600' : 'text-yellow-600'
                  }`}
                >
                  {rating === 'good' ? '🎉 رائع جداً!' : '💪 حاول مرة أخرى!'}
                </motion.div>
              )}
            </AnimatePresence>

            {/* زر جديد */}
            {showRating && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => {
                  setRecordedUrl(null);
                  setRating(null);
                  setShowRating(false);
                }}
                className="mt-4 px-6 py-2 rounded-full bg-purple-600 text-white font-bold text-sm shadow hover:bg-purple-700 transition"
              >
                سجل مجدداً
              </motion.button>
            )}
          </>
        )}
      </div>

      <div className="text-lg font-bold">
        {scores.map((s, i) => (
          <span key={i} className={s === 'good' ? 'text-yellow-400' : 'text-white/30'}>
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
}
