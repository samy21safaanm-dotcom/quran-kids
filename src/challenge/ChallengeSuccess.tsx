import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: () => void;
}

export default function ChallengeSuccess({ onNext }: Props) {
   return (
     <motion.div className="flex flex-col items-center justify-center gap-4 sm:gap-6 p-4 sm:p-6 md:p-8 relative w-full">
      <img src="/images/win-confetti.png" alt="مؤثرات احتفالية" className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" />
      <img src="/images/trophy.png" alt="كأس الفوز" className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 mb-1 sm:mb-2 z-10" />
       <div className="text-lg sm:text-xl md:text-2xl font-bold text-purple-700 z-10 text-center">أحسنت! أنجزت التحدي بنجاح</div>
      <img src="/images/chest.png" alt="صندوق الجوائز" className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 z-10 relative" style={{ opacity: 1 }} />
       <button
         onClick={onNext}
         className="mt-2 sm:mt-4 w-full sm:w-auto px-5 sm:px-7 md:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-400 to-purple-400 text-white rounded-full text-base sm:text-lg font-bold shadow-lg hover:scale-105 transition z-10 flex items-center justify-center gap-2 min-h-11"
       >
         <img src="/images/play-btn.png" alt="زر التالي" className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 inline-block" />
         التالي
       </button>
     </motion.div>
  );
}
