import React from 'react';

interface Props {
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export default function ChallengeProgress({ onNext, onRetry, onBack }: Props) {
  return (
    <footer className="w-full flex items-center justify-center gap-4 py-4 bg-gradient-to-t from-yellow-100/40 to-transparent mt-2">
      <button onClick={onNext} className="btn-gold px-8 py-3 rounded-2xl font-black text-lg shadow hover:scale-105 transition">التالي</button>
      <button onClick={onRetry} className="bg-white/30 px-6 py-3 rounded-2xl font-bold text-purple-700 hover:bg-white/60 transition">إعادة المحاولة</button>
      <button onClick={onBack} className="bg-purple-200/60 px-6 py-3 rounded-2xl font-bold text-purple-900 hover:bg-purple-300 transition">العودة للسورة</button>
    </footer>
  );
}
