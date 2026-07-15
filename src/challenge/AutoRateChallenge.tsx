"use client";
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  ayat: string[];
  onSuccess?: () => void;
}

// تطبيع النص: إزالة التشكيل والعلامات
function normalizeArabic(text: string): string {
  return text
    .replace(/[\u064B-\u0652]/g, '') // إزالة التشكيل
    .replace(/[\s\-]/g, '') // إزالة المسافات والشرطات
    .toLowerCase()
    .trim();
}

// حساب التشابه بين نصين
function calculateSimilarity(a: string, b: string): number {
  const norm_a = normalizeArabic(a);
  const norm_b = normalizeArabic(b);
  
  if (norm_a === norm_b) return 1;
  if (!norm_a || !norm_b) return 0;
  
  const longer = norm_a.length > norm_b.length ? norm_a : norm_b;
  const shorter = norm_a.length > norm_b.length ? norm_b : norm_a;
  
  const matches = Array.from(shorter).filter(c => longer.includes(c)).length;
  return matches / longer.length;
}

// مقارنة تفصيلية كلمة بكلمة
function compareWords(recorded: string, original: string) {
  const recordedWords = recorded.split(/\s+/).filter(w => w);
  const originalWords = original.split(/\s+/).filter(w => w);
  
  return originalWords.map((word, idx) => {
    const recWord = recordedWords[idx] || '';
    const isCorrect = normalizeArabic(recWord) === normalizeArabic(word);
    return { word, recWord, isCorrect };
  });
}

export default function AutoRateChallenge({ ayat, onSuccess }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [recognizing, setRecognizing] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [scores, setScores] = useState<number[]>([]);
  
  const recognitionRef = useRef<any>(null);
  const [browserSupport, setBrowserSupport] = useState(true);

  // تهيئة Web Speech API عند التحميل
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setBrowserSupport(false);
      return;
    }

    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.lang = 'ar-SA';
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;

    recognitionRef.current.onstart = () => setRecognizing(true);
    recognitionRef.current.onend = () => setRecognizing(false);
    recognitionRef.current.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setRecognizing(false);
    };
    recognitionRef.current.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');
      setRecognizedText(transcript);
    };
  }, []);

  if (!browserSupport) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="text-5xl">⚠️</span>
        <div className="text-lg font-bold text-red-600">
          متصفحك لا يدعم تسجيل الصوت
        </div>
        <div className="text-sm text-gray-600">
          استخدم Chrome أو Firefox أو Safari
        </div>
      </div>
    );
  }

  if (completed) {
    const avgScore = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b) / scores.length) * 100) : 0;
    const perfectCount = scores.filter(s => s >= 0.9).length;

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
          🎤
        </motion.span>
        <div className="text-xl sm:text-2xl font-black text-purple-900 text-center">أحسنت! أكملت التقييم 🎉</div>
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="text-base sm:text-lg text-purple-700 font-bold text-center">
            متوسط الدقة: {avgScore}%
          </div>
          <div className="text-xs sm:text-sm text-purple-600 text-center">
            {perfectCount} من {scores.length} بدقة ممتازة (90%+)
          </div>
        </div>
        <div className="flex gap-1 mt-2">
          {scores.map((s, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`text-2xl sm:text-3xl ${s >= 0.9 ? 'text-yellow-400' : s >= 0.7 ? 'text-orange-400' : 'text-gray-400'}`}
            >
              ⭐
            </motion.span>
          ))}
        </div>
        <audio src="/audios/clap.mp3" autoPlay style={{ display: 'none' }} />
      </motion.div>
    );
  }

  const currentAyah = ayat[currentIdx];
  const comparison = recognizedText ? compareWords(recognizedText, currentAyah) : [];
  const similarity = recognizedText ? calculateSimilarity(recognizedText, currentAyah) : 0;

  const handleStartRecording = async () => {
    if (!recognitionRef.current) return;
    setRecognizedText('');
    setShowResult(false);
    recognitionRef.current.start();
  };

  const handleStopRecording = () => {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setRecording(false);
  };

  const handleNext = () => {
    const newScores = [...scores, similarity];
    setScores(newScores);

    if (currentIdx + 1 >= ayat.length) {
      setCompleted(true);
      onSuccess?.();
    } else {
      setCurrentIdx(i => i + 1);
      setRecognizedText('');
      setShowResult(false);
    }
  };

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

      {/* عرض الآية الأصلية */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl p-4 sm:p-6 md:p-8 text-center border-2 border-yellow-300 shadow-xl"
        >
          <div className="text-sm text-purple-500 font-bold mb-4">
            الآية الأصلية {currentIdx + 1} من {ayat.length}
          </div>
          <div
            className="text-xl sm:text-2xl md:text-4xl font-black text-purple-900 leading-relaxed"
            style={{ fontFamily: 'Tajawal, Arial' }}
          >
            {currentAyah}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* منطقة التسجيل */}
      {!recognizedText ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleStartRecording}
          disabled={recognizing}
          className={`relative w-full sm:w-auto sm:min-w-[240px] px-5 sm:px-8 md:px-10 py-3 sm:py-4 md:py-6 rounded-full font-black text-base sm:text-xl md:text-2xl shadow-2xl border-4 transition-all min-h-11 ${
            recognizing
              ? 'bg-red-500 text-white border-red-700 animate-pulse'
              : 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-700 hover:shadow-2xl'
          }`}
        >
          {recognizing ? (
            <span className="flex items-center gap-2">
              🔴 جاري الاستماع...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              🎤 ابدأ التسجيل
            </span>
          )}
        </motion.button>
      ) : (
        <>
          {/* عرض النص المسجل */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full bg-white/90 rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-blue-300"
          >
            <div className="text-sm text-blue-500 font-bold mb-3">
              النص المسجل:
            </div>
            <div
              className="text-lg sm:text-2xl md:text-3xl font-black text-blue-900 leading-relaxed mb-4"
              style={{ fontFamily: 'Tajawal, Arial' }}
            >
              {recognizedText}
            </div>

            {/* عرض المقارنة كلمة بكلمة */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 font-bold mb-2">المقارنة التفصيلية:</div>
              <div className="flex flex-wrap gap-2 justify-center">
                {comparison.map((item, idx) => (
                  <span
                    key={idx}
                    className={`px-3 py-1 rounded-lg font-bold text-sm transition-all ${
                      item.isCorrect
                        ? 'bg-green-100 text-green-700 border border-green-400'
                        : 'bg-red-100 text-red-700 border border-red-400'
                    }`}
                  >
                    {item.word}
                    {item.isCorrect ? ' ✓' : ' ✗'}
                  </span>
                ))}
              </div>
            </div>

            {/* شريط الدقة */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-gray-700">دقة التطابق:</span>
                <span className={`font-black text-xl ${
                  similarity >= 0.9 ? 'text-green-600' :
                  similarity >= 0.7 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {Math.round(similarity * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${similarity * 100}%` }}
                  transition={{ duration: 0.8 }}
                  className={`h-full transition-all ${
                    similarity >= 0.9 ? 'bg-green-500' :
                    similarity >= 0.7 ? 'bg-yellow-500' :
                    'bg-red-500'
                  }`}
                />
              </div>
            </div>

            {/* التقييم */}
            <div className="text-center mb-4">
              {similarity >= 0.9 && <div className="text-lg sm:text-xl font-black text-green-600">🎉 ممتاز جداً!</div>}
              {similarity >= 0.7 && similarity < 0.9 && <div className="text-lg sm:text-xl font-black text-yellow-600">👏 جيد، حاول أكثر</div>}
              {similarity < 0.7 && <div className="text-lg sm:text-xl font-black text-red-600">💪 حاول مرة أخرى</div>}
            </div>
          </motion.div>

          {/* أزرار التحكم */}
          <div className="flex flex-col sm:flex-row gap-3 flex-wrap justify-center w-full">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => {
                setRecognizedText('');
                setShowResult(false);
              }}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-blue-500 text-white font-bold shadow hover:bg-blue-600 transition min-h-11"
            >
              🔄 سجل مجدداً
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleNext}
              className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-green-500 text-white font-bold shadow hover:bg-green-600 transition min-h-11"
            >
              ✓ التالي
            </motion.button>
          </div>
        </>
      )}

      {/* شريط النقاط */}
      <div className="text-base sm:text-lg font-bold flex gap-1">
        {scores.map((s, i) => (
          <span key={i} className={s >= 0.9 ? 'text-yellow-400' : s >= 0.7 ? 'text-orange-400' : 'text-gray-400'}>
            ⭐
          </span>
        ))}
      </div>
    </div>
  );
}
