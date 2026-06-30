"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  ayat: string[];
  onSuccess?: () => void;
}

const BUBBLE_COLORS = [
  { bg: '#F5C842', text: '#4C1D95', shadow: '#f5c84288' },
  { bg: '#A78BFA', text: '#fff', shadow: '#a78bfa88' },
  { bg: '#34D399', text: '#fff', shadow: '#34d39988' },
  { bg: '#F97316', text: '#fff', shadow: '#f9731688' },
];

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function getMiddleWord(ayah: string): { before: string; word: string; after: string } {
  const words = ayah.trim().split(/\s+/);
  // اختر كلمة مميزة (ليست الأولى)
  const idx = words.length > 2 ? Math.floor(words.length / 2) : words.length - 1;
  return {
    before: words.slice(0, idx).join(' '),
    word: words[idx],
    after: words.slice(idx + 1).join(' '),
  };
}

export default function FlyingWordsGame({ ayat, onSuccess }: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [options, setOptions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const { before, word: correctWord, after } = getMiddleWord(ayat[currentIdx] ?? '');

  useEffect(() => {
    const allOtherWords = ayat
      .filter((_, i) => i !== currentIdx)
      .flatMap(a => a.trim().split(/\s+/))
      .filter(w => w !== correctWord && w.length > 1);
    const wrong = shuffle([...new Set(allOtherWords)]).slice(0, 3);
    setOptions(shuffle([correctWord, ...wrong]));
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
    }, 1400);
  };

  if (completed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.7 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 py-8"
      >
        <motion.span
          animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="text-7xl"
        >
          🏆
        </motion.span>
        <div className="text-2xl font-black text-white drop-shadow-lg">أنت بطل! 🎉</div>
        <div className="flex gap-1 mt-1">
          {ayat.map((_, i) => (
            <motion.span
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className={`text-3xl ${i < score ? 'text-yellow-400' : 'text-gray-400'}`}
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
    <div className="w-full max-w-lg mx-auto flex flex-col gap-6 items-center">
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

      {/* بطاقة الآية الناقصة */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIdx}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="w-full rounded-3xl p-6 shadow-2xl border-2 border-purple-400/60 text-center"
          style={{ background: 'rgba(49,10,130,0.82)' }}
        >
          <div className="text-yellow-300 font-bold text-sm mb-3">🎮 أوجد الكلمة الصحيحة!</div>
          <div
            className="flex flex-row items-center justify-center gap-3 flex-wrap"
            style={{ fontFamily: 'Tajawal, Arial' }}
          >
            {before && (
              <span className="text-2xl md:text-3xl font-black text-white">{before}</span>
            )}
            <motion.span
              animate={showResult ? {} : { opacity: [1, 0.4, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className={`inline-block px-4 py-2 rounded-xl border-2 min-w-[80px] text-2xl md:text-3xl font-black text-center transition-colors ${
                showResult && selected === correctWord
                  ? 'bg-green-400 border-green-300 text-white'
                  : showResult
                  ? 'bg-red-400 border-red-300 text-white'
                  : 'bg-yellow-400/30 border-yellow-400 text-yellow-300'
              }`}
            >
              {selected ?? '؟؟؟'}
            </motion.span>
            {after && (
              <span className="text-2xl md:text-3xl font-black text-white">{after}</span>
            )}
          </div>
          {showResult && selected !== correctWord && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-3 text-green-300 font-bold text-lg"
            >
              الإجابة الصحيحة: {correctWord}
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* فقاعات الكلمات الطائرة */}
      <div className="flex flex-wrap gap-4 justify-center w-full py-4">
        {options.map((opt, i) => {
          const color = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
          const isCorrect = opt === correctWord;
          const isSelected = opt === selected;
          return (
            <motion.button
              key={`${opt}-${currentIdx}`}
              initial={{ y: 0, scale: 0.8, opacity: 0 }}
              animate={
                showResult
                  ? { scale: isCorrect ? 1.15 : 0.85, opacity: isSelected && !isCorrect ? 0.4 : 1 }
                  : {
                      scale: [1, 1.05, 1],
                      y: [0, -(8 + i * 4), 0],
                      rotate: [0, i % 2 === 0 ? 4 : -4, 0],
                      opacity: 1,
                    }
              }
              transition={
                showResult
                  ? { duration: 0.3 }
                  : {
                      repeat: Infinity,
                      duration: 2.2 + i * 0.4,
                      ease: 'easeInOut',
                      opacity: { duration: 0.3 },
                    }
              }
              whileTap={{ scale: 0.88 }}
              onClick={() => handleSelect(opt)}
              disabled={showResult}
              className="relative px-7 py-5 rounded-full font-black text-xl shadow-2xl border-4 border-white/80 min-w-[110px] text-center"
              style={{
                background: showResult
                  ? isCorrect ? '#22c55e' : isSelected ? '#ef4444' : color.bg + '99'
                  : color.bg,
                color: color.text,
                fontFamily: 'Tajawal, Arial',
                textShadow: '0 2px 6px rgba(0,0,0,0.25)',
                boxShadow: `0 6px 24px ${color.shadow}`,
              }}
            >
              {/* نجمة زخرفية */}
              <span className="absolute -top-2 -right-1 text-sm select-none">
                {['⭐', '✨', '💫', '🌟'][i % 4]}
              </span>
              {opt}
              {showResult && isCorrect && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-3 -left-3 text-2xl"
                >
                  ✅
                </motion.span>
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="text-lg font-bold">
        {ayat.map((_, i) => (
          <span key={i} className={i < score ? 'text-yellow-400' : 'text-white/30'}>⭐</span>
        ))}
      </div>
    </div>
  );
}
