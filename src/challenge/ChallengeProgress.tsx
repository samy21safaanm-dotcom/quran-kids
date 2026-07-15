import React from 'react';

interface Props {
  onNext: () => void;
  onRetry: () => void;
  onBack: () => void;
}

export default function ChallengeProgress({ onNext, onRetry, onBack }: Props) {
  return (
    <footer className="w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 md:gap-4 py-3 sm:py-4 bg-gradient-to-t from-yellow-100/40 to-transparent mt-2 px-2 sm:px-0">
      <button onClick={onNext} className="btn-gold w-full sm:w-auto px-5 sm:px-7 md:px-8 py-2.5 sm:py-3 rounded-2xl font-black text-base sm:text-lg shadow hover:scale-105 transition min-h-11">التالي</button>
      <button onClick={onRetry} className="bg-white/30 w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base text-purple-700 hover:bg-white/60 transition min-h-11">إعادة المحاولة</button>
      <button onClick={onBack} className="bg-purple-200/60 w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base text-purple-900 hover:bg-purple-300 transition min-h-11">العودة للسورة</button>
    </footer>
  );
}
