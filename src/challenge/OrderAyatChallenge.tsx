"use client";
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  ayat: string[];
  onSuccess?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function OrderAyatChallenge({ ayat, onSuccess }: Props) {
  const [order, setOrder] = useState<string[]>(ayat);
  const [selected, setSelected] = useState<number | null>(null);

  React.useEffect(() => {
    setOrder(shuffle(ayat));
    // eslint-disable-next-line
  }, [JSON.stringify(ayat)]);

  const [success, setSuccess] = useState(false);

  const handleTap = (idx: number) => {
    if (success) return;
    if (selected === null) {
      setSelected(idx);
    } else if (selected === idx) {
      setSelected(null);
    } else {
      const newOrder = [...order];
      [newOrder[selected], newOrder[idx]] = [newOrder[idx], newOrder[selected]];
      setOrder(newOrder);
      setSelected(null);
      if (JSON.stringify(newOrder) === JSON.stringify(ayat)) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onSuccess?.();
        }, 1500);
      }
    }
  };

  return (
    <div className="w-full max-w-[min(100%,44rem)] mx-auto flex flex-col gap-3 sm:gap-4 items-center justify-center px-2 sm:px-0">
      <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-2xl p-3 sm:p-4 shadow text-purple-900 font-extrabold text-[clamp(0.95rem,3.8vw,1.125rem)] mb-2 border-2 border-yellow-300 text-center leading-relaxed">
        🧩 اضغط على آية ثم اضغط على آية أخرى لتبديل مكانيهما
      </div>
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full">
        {order.map((ayah, idx) => (
          <motion.button
            key={ayah}
            layout
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            animate={
              selected === idx
                ? { scale: 1.04, boxShadow: '0 0 24px 4px #f5c842aa' }
                : { scale: 1, boxShadow: '0 2px 8px #00000022' }
            }
            whileTap={{ scale: 0.97 }}
            onClick={() => handleTap(idx)}
            className={`relative w-full px-4 sm:px-6 py-3.5 sm:py-5 rounded-2xl font-bold text-[clamp(1rem,4.4vw,1.25rem)] text-purple-900 shadow-lg transition-colors duration-200 min-h-11
              ${selected === idx
                ? 'bg-yellow-200 ring-4 ring-yellow-400'
                : 'bg-white/90 hover:bg-yellow-50'}
            `}
            style={{
              fontFamily: 'Tajawal, Arial',
              direction: 'rtl',
              border: selected === idx ? '2px solid #f5c842' : '2px solid #fde68a',
            }}
          >
            <span className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-purple-100 text-purple-700 font-black text-xs sm:text-sm flex items-center justify-center border border-purple-200">
              {idx + 1}
            </span>
            <span className="block pr-9 sm:pr-10 break-words leading-relaxed">{ayah}</span>
            {selected === idx && (
              <motion.span
                animate={{ opacity: [1, 0.4, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-yellow-500 text-lg sm:text-xl"
              >
                ✦
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
      <AnimatePresence>
        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2 mt-3 sm:mt-4 px-2"
          >
            <span className="text-4xl sm:text-5xl">🎉</span>
            <div className="text-[clamp(1rem,4.8vw,1.25rem)] font-black text-green-600 text-center">رائع! رتبت الآيات بنجاح 🌟</div>
            <audio src="/audios/clap.mp3" autoPlay style={{ display: 'none' }} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
