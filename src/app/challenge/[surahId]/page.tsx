

"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { JUZ_AMMA } from '@/lib/juzAmmaData';
import * as juzAmmaData from '@/lib/juzAmmaData';
import ChallengeScreen from '@/challenge/index';

const AYAT_BY_SURAH_ID: Record<number, juzAmmaData.Ayah[]> = {
  78: juzAmmaData.AN_NABA_AYAT,
  79: juzAmmaData.AN_NAZIAT_AYAT,
  80: juzAmmaData.ABASA_AYAT,
  81: juzAmmaData.AT_TAKWIR_AYAT,
  82: juzAmmaData.AL_INFITAR_AYAT,
  83: juzAmmaData.AL_MUTAFFIFIN_AYAT,
  84: juzAmmaData.AL_INSHIQAQ_AYAT,
  85: juzAmmaData.AL_BURUJ_AYAT,
  86: juzAmmaData.AT_TARIQ_AYAT,
  87: juzAmmaData.AL_ALA_AYAT,
  88: juzAmmaData.AL_GHASHIYAH_AYAT,
  89: juzAmmaData.AL_FAJR_AYAT,
  90: juzAmmaData.AL_BALAD_AYAT,
  91: juzAmmaData.ASH_SHAMS_AYAT,
  92: juzAmmaData.AL_LAYL_AYAT,
  93: juzAmmaData.AD_DUHA_AYAT,
  94: juzAmmaData.ASH_SHARH_AYAT,
  95: juzAmmaData.AT_TIN_AYAT,
  96: juzAmmaData.AL_ALAQ_AYAT,
  97: juzAmmaData.AL_QADR_AYAT,
  98: juzAmmaData.AL_BAYYINAH_AYAT,
  99: juzAmmaData.AL_ZALZALAH_AYAT,
  100: juzAmmaData.AL_ADIYAT_AYAT,
  101: juzAmmaData.AL_QARIAH_AYAT,
  102: juzAmmaData.AL_TAKATHUR_AYAT,
  103: juzAmmaData.AL_ASR_AYAT,
  104: juzAmmaData.AL_HUMAZAH_AYAT,
  105: juzAmmaData.AL_FIL_AYAT,
  106: juzAmmaData.AL_QURAYSH_AYAT,
  107: juzAmmaData.AL_MAUN_AYAT,
  108: juzAmmaData.AL_KAWTHAR_AYAT,
  109: juzAmmaData.AL_KAFIRUN_AYAT,
  110: juzAmmaData.AL_NASR_AYAT,
  111: juzAmmaData.AL_MASAD_AYAT,
  112: juzAmmaData.AL_IKHLAS_AYAT,
  113: juzAmmaData.AL_FALAQ_AYAT,
  114: juzAmmaData.AL_NAS_AYAT,
};

export default function SurahChallengePage() {
  const params = useParams();
  const surahIdNum = params && typeof params.surahId !== 'undefined' ? Number(params.surahId) : NaN;
  if (isNaN(surahIdNum)) {
    return <div className="min-h-screen flex items-center justify-center"><div className="text-2xl text-red-600 font-bold mt-20">رقم السورة غير صحيح</div></div>;
  }
  return <SurahChallengeClient surahIdNum={surahIdNum} />;
}

function SurahChallengeClient({ surahIdNum }: { surahIdNum: number }) {
  const surah = JUZ_AMMA.find((s) => s.id === surahIdNum);
  if (!surah) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl text-red-600 font-bold mt-20">السورة غير موجودة</div>
      </div>
    );
  }

  const ayahSource = AYAT_BY_SURAH_ID[surahIdNum] || [];
  const ayat = ayahSource.map((a) => a.arabic);

  if (!ayat.length) {
    return <div className="text-center text-red-600 mt-10">السورة غير موجودة أو لا توجد بيانات آيات.</div>;
  }

  return <ChallengeScreen ayat={ayat} surahName={`سورة ${surah.name}`} surahId={surahIdNum} />;
}
