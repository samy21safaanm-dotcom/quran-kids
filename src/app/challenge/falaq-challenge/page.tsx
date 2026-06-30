"use client";
import React from 'react';
import { AL_FALAQ_AYAT } from '@/lib/juzAmmaData';
import ChallengeScreen from '@/challenge/index';

export default function FalaqChallengePage() {
  const ayat = AL_FALAQ_AYAT.map((a: any) => a.arabic);
  
  return <ChallengeScreen ayat={ayat} surahName="سورة الفلق" surahId={113} />;
}
