'use client';

import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import JuzAmmaWorld from './JuzAmmaWorld';
import SurahPage from './SurahPage';
import { AL_FIL_AYAT, AL_IKHLAS_AYAT, AL_FALAQ_AYAT, AL_QURAYSH_AYAT, AL_HUMAZAH_AYAT, AL_MAUN_AYAT, AL_NAS_AYAT, AL_NASR_AYAT, AL_KAWTHAR_AYAT, AL_KAFIRUN_AYAT, AL_MASAD_AYAT, AL_ASR_AYAT, AL_TAKATHUR_AYAT, AL_QARIAH_AYAT, AL_ADIYAT_AYAT, AL_ZALZALAH_AYAT, AL_BAYYINAH_AYAT, AL_QADR_AYAT, AL_ALAQ_AYAT, AT_TIN_AYAT, ASH_SHARH_AYAT, AD_DUHA_AYAT, AL_LAYL_AYAT, ASH_SHAMS_AYAT, AL_BALAD_AYAT, AL_FAJR_AYAT, AL_GHASHIYAH_AYAT, AL_ALA_AYAT, AT_TARIQ_AYAT, AL_BURUJ_AYAT, AL_INSHIQAQ_AYAT, AL_MUTAFFIFIN_AYAT, AL_INFITAR_AYAT, AT_TAKWIR_AYAT, ABASA_AYAT, AN_NAZIAT_AYAT, AN_NABA_AYAT, type Surah, type Ayah } from '@/lib/juzAmmaData';
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
    if (surah.id === 99) return AL_ZALZALAH_AYAT;
    if (surah.id === 100) return AL_ADIYAT_AYAT;
    if (surah.id === 98) return AL_BAYYINAH_AYAT;
    if (surah.id === 97) return AL_QADR_AYAT;
    if (surah.id === 96) return AL_ALAQ_AYAT;
    if (surah.id === 95) return AT_TIN_AYAT;
    if (surah.id === 94) return ASH_SHARH_AYAT;
    if (surah.id === 93) return AD_DUHA_AYAT;
    if (surah.id === 92) return AL_LAYL_AYAT;
    if (surah.id === 91) return ASH_SHAMS_AYAT;
    if (surah.id === 90) return AL_BALAD_AYAT;
    if (surah.id === 89) return AL_FAJR_AYAT;
    if (surah.id === 88) return AL_GHASHIYAH_AYAT;
    if (surah.id === 87) return AL_ALA_AYAT;
    if (surah.id === 86) return AT_TARIQ_AYAT;
    if (surah.id === 85) return AL_BURUJ_AYAT;
    if (surah.id === 84) return AL_INSHIQAQ_AYAT;
    if (surah.id === 83) return AL_MUTAFFIFIN_AYAT;
    if (surah.id === 82) return AL_INFITAR_AYAT;
    if (surah.id === 81) return AT_TAKWIR_AYAT;
    if (surah.id === 80) return ABASA_AYAT;
    if (surah.id === 79) return AN_NAZIAT_AYAT;
    if (surah.id === 78) return AN_NABA_AYAT;
    if (surah.id === 106) return AL_QURAYSH_AYAT;
    if (surah.id === 104) return AL_HUMAZAH_AYAT;
    if (surah.id === 103) return AL_ASR_AYAT;
    if (surah.id === 102) return AL_TAKATHUR_AYAT;
    if (surah.id === 101) return AL_QARIAH_AYAT;
    if (surah.id === 108) return AL_KAWTHAR_AYAT;
    if (surah.id === 109) return AL_KAFIRUN_AYAT;
    if (surah.id === 110) return AL_NASR_AYAT;
    if (surah.id === 111) return AL_MASAD_AYAT;
    if (surah.id === 112) return AL_IKHLAS_AYAT;
    if (surah.id === 113) return AL_FALAQ_AYAT;
    if (surah.id === 107) return AL_MAUN_AYAT;
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
