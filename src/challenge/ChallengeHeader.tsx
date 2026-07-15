import React from 'react';
import { motion } from 'framer-motion';

interface Props {
  surahName: string;
  stars: number;
  xp: number;
}

export default function ChallengeHeader({ surahName, stars, xp }: Props) {
  return (
    <header className="w-full flex flex-wrap items-center justify-between gap-3 sm:gap-4 py-3 sm:py-4 px-3 sm:px-4 md:px-8 lg:px-12 bg-gradient-to-r from-yellow-400/30 to-purple-400/30 rounded-b-3xl shadow-lg mb-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <span className="text-[clamp(1.25rem,4.2vw,1.875rem)] font-black gold-text drop-shadow-lg truncate">{surahName}</span>
      </div>
      <div className="flex items-center gap-3 sm:gap-5 md:gap-6 mr-auto sm:mr-0">
        <div className="flex items-center gap-1 shrink-0">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`text-lg sm:text-xl md:text-2xl ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-white/20 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full min-h-9">
          <span className="text-purple-700 font-bold text-xs sm:text-sm">XP</span>
          <span className="font-black text-base sm:text-lg text-purple-900">{xp}</span>
        </div>
      </div>
    </header>
  );
}
