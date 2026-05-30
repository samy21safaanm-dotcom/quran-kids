'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import JuzAmmaWorld from './JuzAmmaWorld';
import SurahPage from './SurahPage';
import { AL_FIL_AYAT, AL_IKHLAS_AYAT, AL_FALAQ_AYAT, AL_NAS_AYAT, type Surah, type Ayah } from '@/lib/juzAmmaData';
import type { Character } from '@/lib/store';

interface Props {
  character: Character;
  childName: string;
  onBack: () => void;
}

const PLACEHOLDER_AYAT = (surah: Surah): Ayah[] =>
  Array.from({ length: surah.ayat }, (_, i) => ({
    number: i + 1,
    arabic: `﴿ الآية ${i + 1} من سورة ${surah.name} ﴾`,
    tafsir: `تفسير الآية ${i + 1} من سورة ${surah.name} — سيتم إضافة التفسير الكامل قريباً.`,
  }));

export default function JuzAmmaExperience({ character, childName, onBack }: Props) {
  const [selectedSurah, setSelectedSurah] = useState<Surah | null>(null);

  const getAyat = (surah: Surah): Ayah[] => {
    if (surah.id === 105) return AL_FIL_AYAT;
    if (surah.id === 112) return AL_IKHLAS_AYAT;
    if (surah.id === 113) return AL_FALAQ_AYAT;
    if (surah.id === 114) return AL_NAS_AYAT;
    return PLACEHOLDER_AYAT(surah);
  };

  return (
    <AnimatePresence mode="wait">
      {!selectedSurah ? (
        <JuzAmmaWorld
          key="world"
          character={character}
          childName={childName}
          stars={125}
          level={3}
          xp={65}
          xpMax={100}
          onSelectSurah={setSelectedSurah}
          onBack={onBack}
        />
      ) : (
        <SurahPage
          key={`surah-${selectedSurah.id}`}
          surah={selectedSurah}
          ayat={getAyat(selectedSurah)}
          onBack={() => setSelectedSurah(null)}
        />
      )}
    </AnimatePresence>
  );
}
