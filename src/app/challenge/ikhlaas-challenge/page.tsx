"use client";
import React from 'react';
import { AL_IKHLAS_AYAT } from '@/lib/juzAmmaData';
import ChallengeScreen from '@/challenge/index';

export default function IkhlaasChallengePage() {
  const ayat = AL_IKHLAS_AYAT.map(a => a.arabic);
  return <ChallengeScreen ayat={ayat} surahName="سورة الإخلاص" surahId={112} />;
}
