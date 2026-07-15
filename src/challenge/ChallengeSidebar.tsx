import React from 'react';
import { motion } from 'framer-motion';
import type { ChildProfile } from './types';
import CharacterNoor from '../components/CharacterNoor';
import CharacterLujain from '../components/CharacterLujain';

interface Props {
  child: ChildProfile;
  progress: number;
}

const chatMessages = [
  '🌟 أحسنت يا بطل!',
  'هيا نرتب الآيات!',
  'استمع جيدًا ثم اختر!',
  'جرب مرة أخرى!',
];

export default function ChallengeSidebar({ child, progress }: Props) {
  const isNoor = child.gender === 'boy';
  return (
    <aside className="w-full flex flex-col items-center gap-4 sm:gap-5 md:gap-6 p-3 sm:p-4 bg-white/10 rounded-3xl shadow-lg mt-1 sm:mt-2">
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="scale-[0.88] sm:scale-100 origin-center">
          {isNoor ? <CharacterNoor size={120} /> : <CharacterLujain size={120} />}
        </div>
        <motion.div
          className="bg-white/80 rounded-2xl px-3 sm:px-4 py-2 text-purple-700 font-bold text-base sm:text-lg shadow-md text-center max-w-full break-words"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
        >
          {chatMessages[Math.floor(Math.random() * chatMessages.length)]}
        </motion.div>
      </div>
      <div className="w-full flex flex-col items-center gap-2 mt-2 sm:mt-3 md:mt-4">
        <div className="bg-gradient-to-r from-yellow-200 to-purple-200 rounded-xl p-2.5 sm:p-3 w-full text-center font-bold text-purple-900 shadow text-sm sm:text-base leading-relaxed">
          {child.name} <span className="text-[11px] sm:text-xs text-purple-500">({child.age} سنة)</span>
        </div>
        <div className="flex flex-wrap items-center justify-center sm:justify-between gap-x-3 gap-y-1.5 w-full text-[11px] sm:text-xs text-purple-700">
          <span className="whitespace-nowrap">المستوى: {child.level}</span>
          <span className="whitespace-nowrap">النجوم: {child.stars}</span>
          <span className="whitespace-nowrap">السور: {child.completedSurahs}</span>
        </div>
        <div className="w-full mt-1.5 sm:mt-2">
          <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-purple-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-[11px] sm:text-xs text-purple-700 mt-1 text-center">إنجاز التحدي: {progress}%</div>
        </div>
      </div>
    </aside>
  );
}
