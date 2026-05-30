"use client";
import React, { useState } from 'react';
// (تمت إزالة التكرار)
// ...existing code...
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';
import VerseCard from '../components/VerseCard';

interface Props {
  ayat: string[];
  onSuccess?: () => void;
}

function shuffle<T>(arr: T[]): T[] {
  return arr
    .map((v) => [Math.random(), v] as [number, T])
    .sort((a, b) => a[0] - b[0])
    .map(([, v]) => v);
}


export default function OrderAyatChallenge({ ayat, onSuccess }: Props) {
  // مكون عنصر آية قابل للسحب والإفلات
  function AyahCard({ ayah, idx, moveUp, moveDown, isFirst, isLast }: {
    ayah: string;
    idx: number;
    moveUp: () => void;
    moveDown: () => void;
    isFirst: boolean;
    isLast: boolean;
  }) {
    return (
      <div className="flex items-center gap-2 w-full">
        <button
          className={`p-2 rounded-full bg-yellow-100 text-purple-700 hover:bg-yellow-300 transition ${isFirst ? 'opacity-40 cursor-not-allowed' : ''}`}
          onClick={moveUp}
          disabled={isFirst}
          aria-label="تحريك لأعلى"
        >
          <FaArrowUp />
        </button>
        <button
          className={`p-2 rounded-full bg-yellow-100 text-purple-700 hover:bg-yellow-300 transition ${isLast ? 'opacity-40 cursor-not-allowed' : ''}`}
          onClick={moveDown}
          disabled={isLast}
          aria-label="تحريك لأسفل"
        >
          <FaArrowDown />
        </button>
        <div className="flex-1">
          <VerseCard ayah={ayah} index={idx} />
        </div>
      </div>
    );
  }

  // إصلاح مشكلة hydration: ترتيب عشوائي فقط على العميل بعد أول render
  const [order, setOrder] = useState<string[]>(ayat);
  React.useEffect(() => {
    setOrder(shuffle(ayat));
    // eslint-disable-next-line
  }, [JSON.stringify(ayat)]);
  const [success, setSuccess] = useState(false);

  // تحريك العنصر لأعلى
  const moveUp = (idx: number) => {
    if (idx === 0) return;
    const newOrder = [...order];
    [newOrder[idx - 1], newOrder[idx]] = [newOrder[idx], newOrder[idx - 1]];
    setOrder(newOrder);
    checkOrder(newOrder);
  };
  // تحريك العنصر لأسفل
  const moveDown = (idx: number) => {
    if (idx === order.length - 1) return;
    const newOrder = [...order];
    [newOrder[idx + 1], newOrder[idx]] = [newOrder[idx], newOrder[idx + 1]];
    setOrder(newOrder);
    checkOrder(newOrder);
  };
  // تحقق من الترتيب
  const checkOrder = (currentOrder: string[]) => {
    if (JSON.stringify(currentOrder) === JSON.stringify(ayat)) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess && onSuccess();
      }, 1200);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col gap-4 items-center justify-center">
      <div className="bg-yellow-100 rounded-2xl p-4 shadow-lg text-purple-900 font-extrabold text-xl mb-2 tracking-wide border-2 border-yellow-300 flex items-center gap-2">
        <span role="img" aria-label="ترتيب">🧩</span>
        اسحب أو استخدم الأسهم لترتيب الآيات بالترتيب الصحيح
      </div>
      <div className="flex flex-col gap-2 w-full">
        {order.map((ayah, idx) => (
          <AyahCard
            key={ayah}
            ayah={ayah}
            idx={idx}
            moveUp={() => moveUp(idx)}
            moveDown={() => moveDown(idx)}
            isFirst={idx === 0}
            isLast={idx === order.length - 1}
          />
        ))}
      </div>
      <AnimatePresence>
        {success && (
          <div className="flex flex-col items-center gap-2 mt-6 animate-bounceIn">
            <span className="text-5xl text-yellow-400 animate-bounce">✅</span>
            <div className="text-xl font-black text-purple-700">رائع! رتبت الآيات بنجاح</div>
            <audio src="/audios/clap.mp3" autoPlay style={{display:'none'}} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
