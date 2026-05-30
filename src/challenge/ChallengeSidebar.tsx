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
    <aside className="w-full flex flex-col items-center gap-6 p-4 bg-white/10 rounded-3xl shadow-lg mt-2">
      <div className="flex flex-col items-center gap-2">
        {isNoor ? <CharacterNoor size={120} /> : <CharacterLujain size={120} />}
        <motion.div
          className="bg-white/80 rounded-2xl px-4 py-2 text-purple-700 font-bold text-lg shadow-md"
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.2 }}
        >
          {chatMessages[Math.floor(Math.random() * chatMessages.length)]}
        </motion.div>
      </div>
      <div className="w-full flex flex-col items-center gap-2 mt-4">
        <div className="bg-gradient-to-r from-yellow-200 to-purple-200 rounded-xl p-3 w-full text-center font-bold text-purple-900 shadow">
          {child.name} <span className="text-xs text-purple-500">({child.age} سنة)</span>
        </div>
        <div className="flex items-center justify-between w-full text-xs text-purple-700">
          <span>المستوى: {child.level}</span>
          <span>النجوم: {child.stars}</span>
          <span>السور: {child.completedSurahs}</span>
        </div>
        <div className="w-full mt-2">
          <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
            <motion.div className="h-full bg-gradient-to-r from-yellow-400 to-purple-500" style={{ width: `${progress}%` }} />
          </div>
          <div className="text-xs text-purple-700 mt-1 text-center">إنجاز التحدي: {progress}%</div>
        </div>
      </div>
    </aside>
  );
}
