import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  onNext: () => void;
}

export default function ChallengeSuccess({ onNext }: Props) {
   return (
     <motion.div className="flex flex-col items-center justify-center gap-6 p-8 relative">
      <img src="/images/win-confetti.png" alt="مؤثرات احتفالية" className="absolute inset-0 w-full h-full object-cover opacity-60 pointer-events-none" />
      <img src="/images/trophy.png" alt="كأس الفوز" className="w-32 h-32 mb-2 z-10" />
       <div className="text-2xl font-bold text-purple-700 z-10">أحسنت! أنجزت التحدي بنجاح</div>
      <img src="/images/chest.png" alt="صندوق الجوائز" style={{ width: 200, height: 200, zIndex: 1000, opacity: 1, position: 'relative', background: '#fff' }} />
       <button
         onClick={onNext}
         className="mt-4 px-8 py-3 bg-gradient-to-r from-yellow-400 to-purple-400 text-white rounded-full text-lg font-bold shadow-lg hover:scale-105 transition z-10 flex items-center gap-2"
       >
         <img src="/images/play-btn.png" alt="زر التالي" className="w-7 h-7 inline-block" />
         التالي
       </button>
     </motion.div>
  );
}
