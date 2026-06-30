"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  ayat: string[];
  onSuccess?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getBlank(ayah: string): { before: string; word: string } {
  const words = ayah.trim().split(/\s+/);
  // اختر الكلمة الأخيرة دائماً (الأكثر تميزاً في السورة)
  const word = words[words.length - 1];
  const before = words.slice(0, -1).join(' ');
  return { before, word };
}

export default function SimpleHifzChallenge({ ayat, onSuccess }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [options, setOptions] = useState<string[]>([]);

  const { before, word: correctWord } = getBlank(ayat[currentIdx] ?? '');

  useEffect(() => {
    const otherWords = ayat
      .filter((_, i) => i !== currentIdx)
      .map(a => getBlank(a).word)
      .filter(w => w !== correctWord);
    setOptions(shuffle([correctWord, ...otherWords.slice(0, 2)]));
    setSelected(null);
    setShowResult(false);
  }, [currentIdx, JSON.stringify(ayat)]);

  const handleSelect = (opt: string) => {
    if (showResult) return;
    setSelected(opt);
    setShowResult(true);
    if (opt === correctWord) setScore(s => s + 1);
    setTimeout(() => {
      if (currentIdx + 1 >= ayat.length) {
        setCompleted(true);
        onSuccess?.();
      } else {
        setCurrentIdx(i => i + 1);
      }
    }, 1300);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8"
      >
        <span className="text-7xl">🏆</span>
        <div className="text-2xl font-black text-green-600">أحسنت! أتممت تقييم الحفظ</div>
        <div className="text-lg text-purple-700 font-bold">
          حصلت على {score} من {ayat.length}
        </div>
        <div className="flex gap-1 mt-2">
          {ayat.map((_, i) => (
            <span key={i} className={`text-3xl transition-all ${i < score ? 'text-yellow-400' : 'text-gray-300'}`}>
              ⭐
            </span>
          ))}
        </div>
        <audio src="/audios/clap.mp3" autoPlay style={{ display: 'none' }} />
      </motion.div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center">
      {/* شريط التقدم */}
      <div className="flex gap-2 mt-2">
        {ayat.map((_, i) => (
          <motion.div
            key={i}
            animate={{ scale: i === currentIdx ? 1.3 : 1 }}
            className={`rounded-full transition-all ${
              i < currentIdx ? 'bg-green-400 w-4 h-4' :
              i === currentIdx ? 'bg-yellow-400 w-4 h-4' :
              'bg-gray-200 w-3 h-3'
            }`}
          />
        ))}
      </div>

      {/* بطاقة الآية */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          className="w-full bg-gradient-to-br from-amber-50 to-yellow-100 rounded-3xl p-8 shadow-xl border-2 border-yellow-300 text-center"
        >
          <div className="text-sm text-purple-500 font-bold mb-4">
            الآية {currentIdx + 1} من {ayat.length}
          </div>
          <div
            className="flex flex-row items-center justify-center gap-3 flex-wrap"
            style={{ fontFamily: 'Tajawal, Arial' }}
          >
            {before && (
              <span className="text-2xl md:text-3xl font-black text-purple-900">
                {before}
              </span>
            )}
            <span
              className={`inline-block min-w-[90px] text-2xl md:text-3xl font-black text-center px-3 py-1 rounded-xl border-b-4 transition-all ${
                showResult && selected === correctWord
                  ? 'bg-green-100 border-green-400 text-green-700'
                  : showResult
                  ? 'bg-yellow-100 border-yellow-400 text-purple-800'
                  : 'bg-white/80 border-yellow-400 text-yellow-600'
              }`}
            >
              {selected ?? '؟ ؟ ؟'}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* خيارات الإجابة */}
      <div className="flex gap-4 flex-wrap justify-center w-full">
        {options.map((opt) => {
          const isCorrect = opt === correctWord;
          const isSelected = opt === selected;
          return (
            <motion.button
              key={opt}
              whileTap={{ scale: 0.93 }}
              onClick={() => handleSelect(opt)}
              disabled={showResult}
              className={`px-8 py-5 rounded-2xl font-black text-2xl shadow-lg border-2 transition-all min-w-[120px]
                ${!showResult ? 'bg-white hover:bg-yellow-50 border-yellow-200 text-purple-900 hover:border-yellow-400' : ''}
                ${showResult && isCorrect ? 'bg-green-100 border-green-400 text-green-700 scale-105' : ''}
                ${showResult && isSelected && !isCorrect ? 'bg-red-100 border-red-400 text-red-600 opacity-80' : ''}
                ${showResult && !isSelected && !isCorrect ? 'opacity-40 border-gray-200' : ''}
              `}
              style={{ fontFamily: 'Tajawal, Arial' }}
            >
              {opt}
              {showResult && isCorrect && <span className="mr-2 text-xl">✓</span>}
              {showResult && isSelected && !isCorrect && <span className="mr-2 text-xl">✗</span>}
            </motion.button>
          );
        })}
      </div>

      <div className="text-purple-500 font-bold text-lg">
        {Array.from({ length: ayat.length }).map((_, i) => (
          <span key={i} className={i < score ? 'text-yellow-400' : 'text-gray-300'}>⭐</span>
        ))}
      </div>
    </div>
  );
}
