import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  surahName: string;
  stars: number;
  xp: number;
}

export default function ChallengeHeader({ surahName, stars, xp }: Props) {
  return (
    <header className="w-full flex items-center justify-between py-4 px-4 md:px-12 bg-gradient-to-r from-yellow-400/30 to-purple-400/30 rounded-b-3xl shadow-lg mb-2">
      <div className="flex items-center gap-3">
        <span className="text-2xl md:text-3xl font-black gold-text drop-shadow-lg">{surahName}</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`text-2xl ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full">
          <span className="text-purple-700 font-bold">XP</span>
          <span className="font-black text-lg text-purple-900">{xp}</span>
        </div>
      </div>
    </header>
  );
}
